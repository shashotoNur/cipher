export async function readFileChunk(
	file: File,
	start: number,
	length: number,
): Promise<Uint8Array> {
	try {
		if (!(file instanceof File)) {
			throw new TypeError('Invalid file input.');
		}

		if (start < 0 || length <= 0) {
			throw new RangeError('Start must be >= 0 and length must be > 0.');
		}

		if (start >= file.size) {
			throw new RangeError('Start position is beyond file size.');
		}

		const end = Math.min(start + length, file.size);
		const blob = file.slice(start, end);
		const buffer = await blob.arrayBuffer();

		return new Uint8Array(buffer);
	} catch (error) {
		console.error('Failed to read file chunk:', error);
		throw error;
	}
}
