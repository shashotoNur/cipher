import { createWriteStream } from 'streamsaver';

import deriveKey from 'utils/deriveKey';
import getFileChunk from 'utils/getFileChunk';
import getAlgorithm from 'utils/getAlgorithm';


// Encrypt the merged array of file and filename
const encryptData = async (
    unencryptedChunk: Uint8Array, key: CryptoKey,
    algorithm: { name: string; iv: Uint8Array; }
) => {
    try
    {
        const encryptedChunk = await window.crypto.subtle.encrypt(algorithm, key, unencryptedChunk);
        const encryptedUint8Chunk = new Uint8Array(encryptedChunk);

        return encryptedUint8Chunk;
    }
    catch ({ message })
    {
        console.log(message);
        alert('Operation failed! Please try again...');
    };
};

// Encrypt the provided chunk and save it to storage; repeat
const encryptChunkNSave = async(
    writer: WritableStreamDefaultWriter<any>,
    key: CryptoKey, algorithm: { name: string; iv: Uint8Array; },
    unencryptedChunk: Uint8Array, file: File,
    start: number|undefined, end: number|undefined
) => {
    try
    {
        // Encrypt chunk data
        const encryptedUint8Chunk = await encryptData(unencryptedChunk, key, algorithm);

        if(encryptedUint8Chunk) {

            if(!end) {
                // Initialize end-byte value
                end = 0;

                // Writing filename
                const metaDataLen = encryptedUint8Chunk.length + 1;
                const metaData = new Uint8Array([...[metaDataLen], ...encryptedUint8Chunk])

                // Create a writable pipeline to storage
                writer.write(metaData);
            }
            else writer.write(encryptedUint8Chunk);

            const fileSize = file.size+1;
            // Repeat if required
            if(fileSize > end) {
                const newEnd = end + 50 * 1024 * 1024;
                start = end; end = (fileSize > newEnd) ? newEnd : fileSize;

                const nextChunk = await getFileChunk(file, start, end);
                encryptChunkNSave(writer, key, algorithm, nextChunk as Uint8Array, file, start, end);
            }
            else writer.close();
        };
    }
    catch ({ message })
    {
        console.log(message);
        alert('Operation failed! Please try again...');
    };

};

// Derive key and encrypt first chunk of the file along with its name
const encryptFile = async (file: File, filename: string, passkey: string) =>
{
    try
    {
        const key = await deriveKey(passkey);
        const algorithm = getAlgorithm(passkey);

        if(key && algorithm) {
            // Generate a random filename
            const newName = Math.random().toString(36).substring(2);
            const writableStream = createWriteStream(newName);
            const writer = writableStream.getWriter();

            const filenameArray = new TextEncoder().encode(filename);
            encryptChunkNSave(writer, key, algorithm, filenameArray, file, undefined, undefined);
        }
        else alert('Key generation failed!');
    }
    catch ({ message })
    {
        console.log(message);
        alert('Operation failed! Please try again...');
    };
};


export default encryptFile;