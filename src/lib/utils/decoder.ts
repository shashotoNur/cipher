export function decodeUTF8(arr: Uint8Array): string {
	return new TextDecoder().decode(arr);
}

export function unpackUint16(bytes: Uint8Array): number {
	if (bytes.length < 2) throw new Error('Buffer too short to read Uint16');
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	return view.getUint16(0, true); // true = little endian
}

export function unpackUint32(bytes: Uint8Array) {
	const view = new DataView(bytes.buffer);
	return view.getUint32(0, true); // true for little-endian
}

export function unpackUint64(bytes: Uint8Array): number {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	return Number(view.getBigUint64(0, true)); // little-endian
}
