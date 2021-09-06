import { createWriteStream } from 'streamsaver';
import deriveKey from 'utils/deriveKey';

// Get the byte array of the file before encrypting
const fileToByteArray = (file: File, start: number, end: number) =>
{
    const reader = new FileReader();
    var counter = 0; console.log(++counter); // counter will only be logged once as 1

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
const encryptData = async (unencryptedArray: Uint8Array, key: CryptoKey) =>
{
    // The algorithm to encrypt the file using webcrtpto
    const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };
    try
    {
        const encryptedMergedData = await window.crypto.subtle.encrypt( algorithm, key, unencryptedArray );
        const uint8MergedData = new Uint8Array(encryptedMergedData as ArrayBufferLike);

        return uint8MergedData;
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
            // Generate a random filename
            const newName = Math.random().toString(36).substring(2);
            const fileStream = createWriteStream(newName);
            const writer = fileStream.getWriter();
            // Encrypt chunk data
            const uint8MergedData = await encryptData(unencryptedArray as Uint8Array, key);

            // Create a writable pipeline to storage
            writer.write(uint8MergedData);

            const fiftyMB = 50 * 1024 * 1024;
            if(!start || !end) { start = 0; end = fiftyMB; }

            // Repeat if required
            if(file.size >= end) {
                start = end; end = end + fiftyMB;
                const nextChunk = await fileToByteArray(file, start, (file.size > end) ? end : file.size);
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