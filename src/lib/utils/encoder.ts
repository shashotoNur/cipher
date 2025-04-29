export function encodeUTF8(str: string): Uint8Array {
	return new TextEncoder().encode(str);
}

export function packUint16(val: number): Uint8Array {
	const buf = new Uint8Array(2);
	new DataView(buf.buffer).setUint16(0, val, true);
	return buf;
}

export function packUint32(num: number) {
	const arr = new Uint8Array(4);
	const view = new DataView(arr.buffer);
	view.setUint32(0, num, true); // true for little-endian
	return arr;
}

export function packUint64(value: number): Uint8Array {
	const view = new DataView(new ArrayBuffer(8));
	view.setBigUint64(0, BigInt(value), true); // little-endian
	return new Uint8Array(view.buffer);
}

export function generateAlphanumericString(length: number = 15): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}
