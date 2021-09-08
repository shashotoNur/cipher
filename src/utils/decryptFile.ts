import { createWriteStream } from 'streamsaver';
import deriveKey from 'utils/deriveKey';
import getFileChunk from 'utils/getFileChunk';
import getAlgorithm from 'utils/getAlgorithm';

// Decrypt the file and get the filename and file data
const decryptData = async (
    encryptedChunk: Uint8Array, key: CryptoKey,
    algorithm: { name: string; iv: Uint8Array; }
) => {
    try
    {
        const decryptedChunk = await window.crypto.subtle.decrypt(algorithm, key, encryptedChunk);
        const decryptedUint8Array = new Uint8Array(decryptedChunk);

        return decryptedUint8Array;
    }
    catch (err)
    {
        console.log(err);
        alert('Operation failed! Please try again...');
    };
};

// Decrypt the provided chunk and save it to storage; repeat
let writableStream: WritableStream<any>, writer: WritableStreamDefaultWriter<any>;
const decryptChunkNSave = async (
    key: CryptoKey, algorithm: { name: string; iv: Uint8Array; },
    encryptedChunk: Uint8Array, file: File,
    start: number, end: number
) => {
    try
    {
        const decryptedUint8Array = await decryptData(encryptedChunk, key, algorithm);
        
        if(decryptedUint8Array) {
            if(start === 0) {
                const border = decryptedUint8Array[0] + 1;

                const filenameArray = decryptedUint8Array.slice(1, border);
                const filename = new TextDecoder().decode(filenameArray);

                const fileChunk = decryptedUint8Array.slice(border, decryptedUint8Array.length);

                writableStream = createWriteStream(filename);
                writer = writableStream.getWriter();

                // Write data through the pipeline to storage
                writer.write(fileChunk);
            }
            else writer.write(decryptedUint8Array);

            const fileSize = file.size+1;

            // Repeat if required
            if(fileSize > end) {
                const newEnd = end + 50 * 1024 * 1024;
                start = end; end = (fileSize > newEnd) ? newEnd : fileSize;
                const nextChunk = await getFileChunk(file, start, end);
                decryptChunkNSave(key, algorithm, nextChunk as Uint8Array, file, start, end);
            }
            else writer.close();
        }
        else alert('Decryption failed!');
    }
    catch ({ message })
    {
        console.log(message);
        alert('Operation failed! Please try again...');
    };
};

// Derive key and decrypt first chunk of the file along with its name
const decryptFile = async (file: File, passkey: string) =>
{
    try
    {
        const key = await deriveKey(passkey);
        const algorithm = getAlgorithm(passkey);

        if(key && algorithm) {
            const fileSize = file.size+1;

            const fiftyMB = 50 * 1024 * 1024;
            const start = 0, end = (fileSize > fiftyMB) ? fiftyMB : fileSize;
            const encryptedChunk = await getFileChunk(file, start, end);
            decryptChunkNSave(key, algorithm, encryptedChunk as Uint8Array, file, start, end);
        }
        else alert('Key generation failed!');
    }
    catch ({ message })
    {
        console.log(message);
        alert('Operation failed! Please try again...');
    };
};


export default decryptFile;