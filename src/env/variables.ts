
const CHUNK_SIZE = 50 * 1024 * 1024; // 50 megabyte
const PADDING = 16;
const IV_SIZE = 12; // 12 bits
const ALGO = "AES-GCM"; // AEAD algorithm

const variables = { CHUNK_SIZE, PADDING, IV_SIZE, ALGO };
export default variables;