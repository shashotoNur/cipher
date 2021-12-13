import { createWriteStream } from 'streamsaver';

import deriveKey from 'utils/deriveKey';
import getAlgorithm from 'utils/getAlgorithm';
import getFileChunk from 'utils/getFileChunk';
import logError from 'utils/logError';
import shouldRepeat from 'utils/shouldRepeat';

import variables from 'env/variables';


// Initialize encryption with key, algo & filename
const encryptFile = async (file: File, filename: string, passkey: string) => {
    // Encrypt any uint8array with a crypto key and algorithm
    const encryptData = async (
        unencryptedData: Uint8Array, key: CryptoKey,
        algorithm: { name: string; iv: Uint8Array; }
    ) => {
        try {
            const encryptedData = await window.crypto.subtle.encrypt(algorithm, key, unencryptedData);
            const encryptedUint8Data = new Uint8Array(encryptedData);
    
            return encryptedUint8Data;

        } catch ({ message }) { logError(message as string); };
    };
    
    // Encrypt the provided chunk and save it to storage; repeat
    const encryptChunkNSave = async(
        writer: WritableStreamDefaultWriter<any>,
        key: CryptoKey, algorithm: { name: string; iv: Uint8Array; },
        file: File, start: number, end: number
    ) => {
        try {
            // Get file chunk
            const unencryptedChunk = await getFileChunk(file, start, end) as Uint8Array;
            // Encrypt and write chunk data
            const encryptedChunk = await encryptData(unencryptedChunk, key, algorithm);
    
            // Write and continue
            if(encryptedChunk) {

                writer.write(encryptedChunk);
    
                const fileSize = file.size + 1;
                const [repeat, newStart, newEnd] = shouldRepeat(fileSize, end);
    
                // Repeat if required
                if(repeat) encryptChunkNSave(writer, key, algorithm, file, newStart as number, newEnd as number);
                else writer.close();
            };

        } catch ({ message }) { logError(message as string); };

    };

    try {
        const key = await deriveKey(passkey);
        const algorithm = getAlgorithm(passkey);

        if(key && algorithm) {

            // Generate a random filename
            const newName = Math.random().toString(36).substring(2);

            // Create a writable pipeline to storage
            const writableStream = createWriteStream(newName);
            const writer = writableStream.getWriter();

            const filenameArray = new TextEncoder().encode(filename);
            const encryptedFilename = await encryptData(filenameArray, key, algorithm);

            if(encryptedFilename) {

                // Writing filename
                const metaDataLen = encryptedFilename.length + 1;
                const metaData = new Uint8Array([...[metaDataLen], ...encryptedFilename])

                // Start writing encrypted filename
                writer.write(metaData);

                // Start encrypting file data
                const start = 0, end = variables.CHUNK_SIZE;
                encryptChunkNSave(writer, key, algorithm, file, start, end);

            } else logError('Filename encryption failed!');

        } else logError('Key generation failed!');

    } catch ({ message }) { logError(message as string); };

};


export default encryptFile;