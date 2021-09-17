
const CHUNK_SIZE = 50 * 1024 * 1024; // 50 megabyte
const PADDING = 16; // 16 bits padding

const IV_SIZE = 12; // 12 bits
const ALGO = "AES-GCM"; // AEAD algorithm

const KEY_ALGO = "PBKDF2"; // Key derivation function (PHS)
const KEY_HASH = 'SHA-256'; // Hash function
const KEY_LEN = 128; // Crypto key length 128 bits
const KEY_ITER = 1000; // Encrypt passkey 1000 times


const variables = { CHUNK_SIZE, PADDING, IV_SIZE, ALGO, KEY_ALGO, KEY_HASH, KEY_LEN, KEY_ITER };
export default variables;