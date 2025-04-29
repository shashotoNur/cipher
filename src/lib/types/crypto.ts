// src/lib/utils/types.ts

export interface EncryptionMetadata {
	hint: string;
	description: string;
	originalName: string;
	timestamp: number;
	version?: string; // optional
}
