import { createWriteStream } from 'streamsaver';
import deriveKey from 'utils/deriveKey';

const reader = new FileReader();
let writableStream: WritableStream<any>, writer: WritableStreamDefaultWriter<any>;

// The algorithm to encrypt the file using webcrtpto
const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };

// Get the binary file data
const getFileChunk = (file: File, start: number, end: number) =>
{
    return new Promise((resolve, _reject) =>
    {
        try
        {
            const chunk = file.slice(start, end);
            reader.readAsArrayBuffer(chunk);
            reader.onload = (event) => { event.target && resolve(event.target.result) };
        }
        catch ({ message })
        {
            console.log(message);
            alert('Operation failed! Please try again...');
        };
    });
};

// Decrypt the file and get the filename and file data
const decryptData = async (encryptedChunk: Uint8Array, key: CryptoKey) =>
{
    try
    {
        const decryptedChunk = await window.crypto.subtle.decrypt(algorithm, key, encryptedChunk);

        if(decryptedChunk) {
            const decryptedUint8Array = new Uint8Array(decryptedChunk);
            return decryptedUint8Array;
        };
    }
    catch ({ message })
    {
        console.log(message);
        alert('Operation failed! Please try again...');
    };
};


// Encrypt the provided chunk and save it to storage; repeat
const decryptChunkNSave = async (
    key: CryptoKey, encryptedChunk: Uint8Array, file: File,
    start: number, end: number
) => {
    try
    {
        
        const decryptedUint8Array = await decryptData(encryptedChunk, key);
        
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

            // Repeat if required
            if(file.size >= end) {
                const newEnd = end + 50 * 1024 * 1024;
                start = end; end = (file.size > newEnd) ? newEnd : file.size;
                const nextChunk = await getFileChunk(file, start, end);
                decryptChunkNSave(key, nextChunk as Uint8Array, file, start, end);
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
const decryptFile = async (file: File, passkey: string) =>
{
    try
    {
        const key = await deriveKey(passkey);

        if(key) {
            const start = 0, end = 50 * 1024 * 1024;
            const encryptedChunk = await getFileChunk(file, start, end);
            decryptChunkNSave(key, encryptedChunk as Uint8Array, file, start, end);
        }
        else alert('Key generation failed! Please try again...');
    }
    catch ({ message })
    {
        console.log(message);
        alert('Operation failed! Please try again...');
    };
};


export default decryptFile;