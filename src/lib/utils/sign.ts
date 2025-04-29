import {
	AUTH_ALGORITHM,
	ENCRYPTION_ALGO,
	HASH_ALGORITHM,
	KEY_ALGORITHM,
	NONCE_LENGTH,
	PBKDF2_ITERATIONS,
	SALT_LENGTH,
	VERSION
} from '$lib/constants/index.js';
import { deriveKey } from '$lib/crypto/keygen.js';
import { fileTimestamp } from '$lib/stores/appStore.js';
import { unpackUint16, unpackUint32, unpackUint64 } from './decoder.js';
import { encodeUTF8 } from './encoder.js';
import { readFileChunk } from './reader.js';

export async function signData(
	data: Uint8Array,
	password: string,
	salt: Uint8Array
): Promise<Uint8Array> {
	const encoder = new TextEncoder();
	const passwordKey = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		{ name: KEY_ALGORITHM },
		false,
		['deriveKey']
	);

	const key = await crypto.subtle.deriveKey(
		{
			name: KEY_ALGORITHM,
			salt,
			iterations: PBKDF2_ITERATIONS,
			hash: HASH_ALGORITHM
		},
		passwordKey,
		{ name: AUTH_ALGORITHM, hash: HASH_ALGORITHM },
		false,
		['sign', 'verify']
	);

	const signature = await crypto.subtle.sign(AUTH_ALGORITHM, key, data);
	return new Uint8Array(signature);
}

export async function verifyUnencryptedData(file: File, password: string): Promise<boolean> {
	const fileSize = file.size;

	const signatureLen = unpackUint16(await readFileChunk(file, fileSize - 4, 2));
	const signature = await readFileChunk(file, fileSize - (4 + signatureLen), signatureLen);

	let fileOffset = 0;

	const prefixLen = unpackUint16(await readFileChunk(file, fileSize - 2, 2));
	const prefix = await readFileChunk(file, fileOffset, prefixLen);

	fileOffset += VERSION.length;
	const salt = await readFileChunk(file, fileOffset, SALT_LENGTH);
	fileOffset += SALT_LENGTH;

	const passwordKey = await crypto.subtle.importKey(
		'raw',
		encodeUTF8(password),
		{ name: KEY_ALGORITHM },
		false,
		['deriveKey']
	);

	const key = await crypto.subtle.deriveKey(
		{
			name: KEY_ALGORITHM,
			salt,
			iterations: PBKDF2_ITERATIONS,
			hash: HASH_ALGORITHM
		},
		passwordKey,
		{ name: AUTH_ALGORITHM, hash: HASH_ALGORITHM },
		false,
		['sign', 'verify']
	);

	const signatureValid = await crypto.subtle.verify(AUTH_ALGORITHM, key, signature, prefix);
	if (!signatureValid) return false;

	const headerNonce = await readFileChunk(file, fileOffset, NONCE_LENGTH);
	fileOffset += NONCE_LENGTH;

	const hintLen = unpackUint16(await readFileChunk(file, fileOffset, 2));
	fileOffset += 2 + hintLen;
	const descLen = unpackUint16(await readFileChunk(file, fileOffset, 2));
	fileOffset += 2 + descLen;

	const encHeaderLength = unpackUint32(await readFileChunk(file, fileOffset, 4));
	fileOffset += 4;
	const encHeader = await readFileChunk(file, fileOffset, encHeaderLength);
	fileOffset += encHeaderLength;

	const headerPlain = new Uint8Array(
		await crypto.subtle.decrypt(
			{ name: ENCRYPTION_ALGO, iv: headerNonce },
			await deriveKey(password, salt),
			encHeader
		)
	);

	let headerOffset = 0;
	const nameLen = new DataView(headerPlain.buffer).getUint16(headerOffset, true);
	headerOffset += 2 + nameLen;
	const timeLen = new DataView(headerPlain.buffer).getUint16(headerOffset, true);
	headerOffset += 2;
	const decryptedTimestamp = unpackUint64(headerPlain.slice(headerOffset, headerOffset + timeLen));

	fileTimestamp.set(decryptedTimestamp);
	return true;
}
