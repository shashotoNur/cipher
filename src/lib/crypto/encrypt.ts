import { chunksProcessed } from '$lib/stores/appStore.js';
import { CHUNK_SIZE, ENCRYPTION_ALGO, STREAMSAVER_MITM_URL, VERSION } from '../constants/index.js';
import type { EncryptionMetadata } from '../types/crypto.js';
import {
	encodeUTF8,
	generateAlphanumericString,
	packUint16,
	packUint32,
	packUint64
} from '../utils/encoder.js';
import { deriveKey, generateNonce, generateSalt } from './keygen.js';
import { signData } from './sign.js';

export async function encryptFileAndSave(
	file: File,
	password: string,
	metadata: EncryptionMetadata
) {
	const streamsaver = (await import('streamsaver')).default;
	streamsaver.mitm = STREAMSAVER_MITM_URL;
	const salt = generateSalt();
	const key = await deriveKey(password, salt);
	const fileStream = streamsaver.createWriteStream(generateAlphanumericString() + '.cphr');
	const writer = fileStream.getWriter();

	// Prepare metadata
	const version = metadata.version ?? VERSION;
	const hintBytes = encodeUTF8(metadata.hint || 'None');
	const descBytes = encodeUTF8(metadata.description || 'None');
	const nameBytes = encodeUTF8(metadata.originalName);
	const timeBytes = packUint64(metadata.timestamp);

	const headerData = new Uint8Array([
		...packUint16(nameBytes.length),
		...nameBytes,
		...packUint16(timeBytes.length),
		...timeBytes
	]);

	const headerNonce = generateNonce();
	const encryptedHeader = new Uint8Array(
		await crypto.subtle.encrypt({ name: ENCRYPTION_ALGO, iv: headerNonce }, key, headerData)
	);

	const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

	const prefixBuffer = new Uint8Array([
		...encodeUTF8(version),
		...salt,
		...headerNonce,
		...packUint16(hintBytes.length),
		...hintBytes,
		...packUint16(descBytes.length),
		...descBytes,
		...packUint32(encryptedHeader.length),
		...encryptedHeader,
		...packUint32(totalChunks)
	]);

	await writer.write(prefixBuffer);

	let offset = 0;
	while (offset < file.size) {
		const chunk = file.slice(offset, offset + CHUNK_SIZE);
		const chunkData = new Uint8Array(await chunk.arrayBuffer());

		const chunkNonce = generateNonce();
		const encryptedChunk = new Uint8Array(
			await crypto.subtle.encrypt({ name: ENCRYPTION_ALGO, iv: chunkNonce }, key, chunkData)
		);

		await writer.write(chunkNonce);
		await writer.write(packUint32(encryptedChunk.length));
		await writer.write(encryptedChunk);

		offset += CHUNK_SIZE;
		chunksProcessed.update((n) => n + 1);
	}

	const signature = await signData(prefixBuffer, password, salt);
	await writer.write(signature);
	await writer.write(packUint16(signature.length));
	await writer.write(packUint16(prefixBuffer.length));

	await writer.close();
}
