import { createWriteStream } from 'streamsaver';

import deriveKey from 'utils/deriveKey';
import getAlgorithm from 'utils/getAlgorithm';
import getFileChunk from 'utils/getFileChunk';
import logError from 'utils/logError';
import shouldRepeat from 'utils/shouldRepeat';

import variables from 'env/variables';


// Initialize decryption with key, algo & filename
const decryptFile = async (file: File, passkey: string) => {

    // Decrypt any uint8array with a crypto key and algorithm
    const decryptData = async (
        encryptedData: Uint8Array, key: CryptoKey,
        algorithm: { name: string; iv: Uint8Array; }
    ) => {
        try {
            const decryptedData = await window.crypto.subtle.decrypt(algorithm, key, encryptedData);
            const decryptedUint8Data = new Uint8Array(decryptedData);
    
            return decryptedUint8Data;

        } catch ({ message }) { logError(message as string); };

    };

    // Decrypt the provided chunk and save it to storage; repeat
    const decryptChunkNSave = async (
        writer: WritableStreamDefaultWriter<any>,
        key: CryptoKey, algorithm: { name: string; iv: Uint8Array; },
        file: File, start: number, end: number
    ) => {
        try {
            // Get encrypted file chunk
            const encryptedChunk = await getFileChunk(file, start, end);
    
            // Decrypt file chunk
            const decryptedChunk = await decryptData(encryptedChunk as Uint8Array, key, algorithm);
    
            // Write and continue
            if(decryptedChunk) {

                writer.write(decryptedChunk);
    
                // Check operation status and update variables
                const fileSize = file.size + 1;
                const [repeat, newStart, newEnd] = shouldRepeat(fileSize, end);
                const paddedEnd = newEnd as number + variables.PADDING;
    
                // Repeat if required
                if(repeat) decryptChunkNSave(writer, key, algorithm, file, newStart as number, paddedEnd);
                else writer.close();
            };

        } catch ({ message }) { logError(message as string); };

    };


    try {
        const key = await deriveKey(passkey);
        const algorithm = getAlgorithm(passkey);

        if(key && algorithm) {

            // Extract and decrypt filename array
            const metaDataLen = (await getFileChunk(file, 0, 1) as Uint8Array)[0];
            const encryptedFilename = await getFileChunk(file, 1, metaDataLen);
            const decryptedFilenameArray = await decryptData(encryptedFilename as Uint8Array, key, algorithm);

            if(decryptedFilenameArray) {

                // Convert filename Uint8array to string
                const filename = new TextDecoder().decode(decryptedFilenameArray);

                // Create a writable pipeline to storage
                const writableStream = createWriteStream(filename);
                const writer = writableStream.getWriter();

                // Start encrypting file data
                const start = metaDataLen, end = metaDataLen + variables.CHUNK_SIZE + variables.PADDING;
                decryptChunkNSave(writer, key, algorithm, file, start, end);
            };

        } else logError('Key generation failed!');

    } catch ({ message }) { logError(message as string); };

};


export default decryptFile;