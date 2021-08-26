import { saveAs } from 'file-saver';
import deriveKey from 'utils/deriveKey';


// Get the binary file data
const getFileData = (file: File) =>
{
    return new Promise((resolve, _reject) =>
    {
        try
        {
            let reader = new FileReader();
            reader.readAsArrayBuffer(file as Blob);
            reader.onload = (event) => { event.target && resolve(event.target.result) };
        }
        catch (err)
        {
            console.log(err.message);
            alert('An error occured! Please try again...');
        };
    });
};

// Decrypt the file and get the filename and file data
const decryptData = async (uint8MergedData: Uint8Array, key: CryptoKey | undefined) =>
{
    try
    {
        // The algorithm to encrypt the file using webcrtpto
        const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };

        const decryptedMergedArray = key && await window.crypto.subtle.decrypt(algorithm, key, uint8MergedData);

        if(decryptedMergedArray) {
            const uint8MergedArray = new Uint8Array(decryptedMergedArray);
            const border = uint8MergedArray[0] + 1;

            const filenameArray = uint8MergedArray.slice(1, border);
            const fileData = uint8MergedArray.slice(border, uint8MergedArray.length);
            const filename = new TextDecoder().decode(filenameArray);

            return { fileData: fileData!, filename: filename! };
        };
    }
    catch (err)
    {
        console.log(err.message);
        alert('An error occured! Please try again...');
    };
};


// Get the encrypted data, decrypt it and save it ints former state
const decryptFile = async (file: File, passkey: string) =>
{
    try
    {
        (async () =>
            {
                const key = await deriveKey(passkey);

                const uint8MergedData = await getFileData(file);
                const decryptedData = await decryptData(uint8MergedData as Uint8Array, key);

                if(decryptedData) {
                    const originalFile = new Blob( [decryptedData.fileData as BlobPart] );
                    saveAs(originalFile, decryptedData.filename as string);
                };
            }
        )();
    }
    catch (err)
    {
        console.log(err.message);
        alert('An error occured! Please try again...');
    };
};


export default decryptFile;