import { createWriteStream } from 'streamsaver';
import deriveKey from 'utils/deriveKey';

const reader = new FileReader();

// The algorithm to encrypt the file using webcrtpto
const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };

// Generate a random filename
const newName = Math.random().toString(36).substring(2);
const writableStream = createWriteStream(newName);
const writer = writableStream.getWriter();

// Get the byte array of the file before encrypting
const fileToByteArray = (file: File, start: number, end: number) =>
{
    return new Promise((resolve, _reject) =>
    {
        try
        {
            let fileByteArray: Uint8Array;
            const chunk = file.slice(start, end);

            reader.readAsArrayBuffer(chunk);
            reader.onloadend = (event) =>
            {
                if (event.target && event.target.readyState === FileReader.DONE)
                {
                    const arrayBuffer = event.target.result;
                    fileByteArray = new Uint8Array(arrayBuffer as ArrayBufferLike);
                };
                resolve(fileByteArray);
            }
        }
        catch ({ message })
        {
            console.log(message);
            alert('Operation failed! Please try again...');
        };
    });
};

// Encrypt the merged array of file and filename
const encryptData = async (unencryptedChunk: Uint8Array, key: CryptoKey) =>
{
    try
    {
        const encryptedChunk = await window.crypto.subtle.encrypt(algorithm, key, unencryptedChunk);
        const uint8ChunkData = new Uint8Array(encryptedChunk as ArrayBufferLike);

        return uint8ChunkData;
    }
    catch ({ message })
    {
        console.log(message);
        alert('Operation failed! Please try again...');
    };
};


// Encrypt the provided chunk and save it to storage; repeat
const encryptChunkNSave = async(
    key: CryptoKey, unencryptedArray: Uint8Array, file: File,
    start: number|undefined, end: number|undefined
) => {
    try
    {
        // Encrypt chunk data
        const uint8ChunkData = await encryptData(unencryptedArray as Uint8Array, key);

        // Create a writable pipeline to storage
        writer.write(uint8ChunkData);

        const fiftyMB = 50 * 1024 * 1024;
        if(!start || !end) { start = 0; end = fiftyMB; };

        // Repeat if required
        if(file.size >= end) {
            const newEnd = end + fiftyMB;
            start = end; end = (file.size > newEnd) ? newEnd : file.size;
            const nextChunk = await fileToByteArray(file, start, end);
            encryptChunkNSave(key, nextChunk as Uint8Array, file, start, end);
        }
        else writer.close();
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
        
        if(key) {
            const filenameArray = new TextEncoder().encode(filename);
            encryptChunkNSave(key, filenameArray, file, undefined, undefined);
        }
        else alert('Key generation failed! Please try again...');
    }
    catch ({ message })
    {
        console.log(message);
        alert('Operation failed! Please try again...');
    };
};


export default encryptFile;