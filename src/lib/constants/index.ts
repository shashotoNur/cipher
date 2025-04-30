export const VERSION = 'CIPHER@00.00.01';
export const CHUNK_SIZE = 64 * 1024 * 1024; // 64MB
export const SALT_LENGTH = 16; // bytes
export const KEY_ALGORITHM = 'PBKDF2';
export const PBKDF2_ITERATIONS = 250_000; // Safe iterations are between 100_000 and 1_000_000
export const HASH_ALGORITHM = 'SHA-256';
export const AUTH_ALGORITHM = 'HMAC';
export const KEY_LENGTH = 256; // bits
export const ENCRYPTION_ALGO = 'AES-GCM';
export const NONCE_LENGTH = 12; // 96-bit nonce for AES-GCM
export const MAX_HINT_LENGTH = 100;
export const MAX_DESC_LENGTH = 300;
export const MIN_PW_STRENGTH = 7;

export const base_url = typeof window !== 'undefined' ? window.location.origin : '';
export const defaultTitle = 'Cipher';
export const defaultDescription =
	'A privacy-focused file encryption & decryption tool (fully offline)';
export const defaultImageUrl = `${base_url}/icons/android-chrome-512x512.png`;
export const defaultCanonicalUrl = base_url;
export const summary = 'File encryption tool';
export const STREAMSAVER_MITM_URL = `${base_url}/streamsaver/mitm.html`;

export const DEFAULT_FILES_TO_IGNORE: string[] = [
	'.DS_Store', // OSX indexing file
	'Thumbs.db' // Windows indexing file
];

export const EXTENSION_TO_MIME_TYPE_MAP: Record<string, string> = {
	avi: 'video/avi',
	gif: 'image/gif',
	ico: 'image/x-icon',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	mkv: 'video/x-matroska',
	mov: 'video/quicktime',
	mp4: 'video/mp4',
	pdf: 'application/pdf',
	png: 'image/png',
	zip: 'application/zip',
	cphr: 'encrypted/octet-stream'
};
