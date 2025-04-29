import { ENCRYPTION_ALGO, NONCE_LENGTH, SALT_LENGTH, VERSION } from '../constants/index.js';
import { chunksProcessed, originalFileName } from '../stores/appStore.js';
import { unpackUint16, unpackUint32 } from '../utils/decoder.js';
import { readFileChunk } from '../utils/reader.js';
import { deriveKey } from './keygen.js';

export async function decryptFileAndSave(file: File, password: string) {
	const streamsaver = (await import('streamsaver')).default;
	let fileOffset = VERSION.length;

	const salt = await readFileChunk(file, fileOffset, SALT_LENGTH);
	fileOffset += SALT_LENGTH;
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

	const key = await deriveKey(password, salt);
	const headerPlain = new Uint8Array(
		await crypto.subtle.decrypt({ name: ENCRYPTION_ALGO, iv: headerNonce }, key, encHeader)
	);

	let headerOffset = 0;
	const nameLen = new DataView(headerPlain.buffer).getUint16(headerOffset, true);
	headerOffset += 2;
	const name = new TextDecoder().decode(headerPlain.slice(headerOffset, headerOffset + nameLen));
	headerOffset += nameLen + 2;

	originalFileName.set(name);

	const chunkCount = unpackUint32(await readFileChunk(file, fileOffset, 4));
	fileOffset += 4;

	const writable = streamsaver.createWriteStream(name);
	const writer = writable.getWriter();

	for (let i = 0; i < chunkCount; i++) {
		console.log({ fileOffset, i });
		const chunkNonce = await readFileChunk(file, fileOffset, NONCE_LENGTH);
		fileOffset += NONCE_LENGTH;

		const chunkLength = unpackUint32(await readFileChunk(file, fileOffset, 4));
		fileOffset += 4;
		console.log({ chunkLength });

		const encrypted = await readFileChunk(file, fileOffset, chunkLength);
		fileOffset += chunkLength;

		const decrypted = new Uint8Array(
			await crypto.subtle.decrypt({ name: ENCRYPTION_ALGO, iv: chunkNonce }, key, encrypted)
		);

		await writer.write(decrypted);
		chunksProcessed.update((n) => n + 1);
	}

	await writer.close();
}
