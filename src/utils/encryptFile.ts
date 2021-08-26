import { saveAs } from 'file-saver';
import deriveKey from 'utils/deriveKey';


// Get the byte array of the file before encrypting
const fileToByteArray = (file: File) =>
{
    return new Promise((resolve, _reject) =>
    {
        try
        {
            const reader = new FileReader();
            let fileByteArray: Uint8Array;

            reader.readAsArrayBuffer(file as Blob);
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
        catch (err)
        {
            console.log(err.message);
            alert('An error occured! Please try again...');
        };
    });
};

// Encrypt the merged array of file and filename
const encryptData = async (fileArray: Uint8Array, filenameArray: Uint8Array, key: CryptoKey | undefined) =>
{
    try
    {
        // The algorithm to encrypt the file using webcrtpto
        const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };
      
        const mergedArray = new Uint8Array([...[filenameArray.length], ...filenameArray, ...fileArray]);
        const encryptedMergedData = key && await window.crypto.subtle.encrypt( algorithm, key, mergedArray );
        const uint8MergedData = new Uint8Array(encryptedMergedData as ArrayBufferLike);

        // Give a unique name to the encrypted file (not important)
        const encryptedFilename = key && await window.crypto.subtle.encrypt( algorithm, key, filenameArray );
        const uint8Filename = new Uint8Array(encryptedFilename as ArrayBufferLike);
        const stringFilename = String.fromCharCode.apply(null, [].slice.call(uint8Filename));
        const base64Filename = btoa(stringFilename);

        return { uint8MergedData: uint8MergedData!, base64Filename: base64Filename! };
    }
    catch (err)
    {
        console.log(err.message);
        alert('An error occured! Please try again...');
    };
}


// Encrypt the provided file along with its name
const encryptFile = async (file: File, filename: string, passkey: string) =>
{
    try
    {
        (async () =>
            {
                const key = await deriveKey(passkey);

                const fileArray = await fileToByteArray(file);
                const filenameArray = new TextEncoder().encode(filename);
                const encryptedData = await encryptData(fileArray as Uint8Array, filenameArray, key);

                if(encryptedData)
                {
                    const binFile = new Blob([encryptedData.uint8MergedData as BlobPart], { type: 'application/octet-stream' });
                    saveAs(binFile, `${ encryptedData.base64Filename }`);
                }
            }
        )();
    }
    catch (err)
    {
        console.log(err.message);
        alert('An error occured! Please try again...');
    };
};

export default encryptFile;