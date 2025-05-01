import {
	ENCRYPTION_ALGO,
	KEY_ALGORITHM,
	KEY_LENGTH,
	NONCE_LENGTH,
	PBKDF2_ITERATIONS,
	SALT_LENGTH,
} from '../constants/index.js';

export function generateSalt(): Uint8Array {
	return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

export function generateNonce(): Uint8Array {
	return crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));
}

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
	const encoder = new TextEncoder();
	const passwordKey = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		{ name: KEY_ALGORITHM },
		false,
		['deriveKey'],
	);

	const derivedKey = await crypto.subtle.deriveKey(
		{
			name: KEY_ALGORITHM,
			salt: salt,
			iterations: PBKDF2_ITERATIONS,
			hash: 'SHA-256',
		},
		passwordKey,
		{
			name: ENCRYPTION_ALGO,
			length: KEY_LENGTH,
		},
		false,
		['encrypt', 'decrypt'],
	);

	return derivedKey;
}
