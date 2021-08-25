import { saveAs } from 'file-saver';
import deriveKey from 'utils/deriveKey';

const fileToByteArray = (file: "" | File) =>
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
        catch (err) { console.log(err.message); };
    });
};

const encryptData = async (data: Uint8Array, encrypting: string, key: CryptoKey | undefined) =>
{
    try
    {
        const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };
        
        const encryptedData = key && await window.crypto.subtle.encrypt( algorithm, key, data );

        const uint8ArrayData = new Uint8Array(encryptedData as ArrayBufferLike);

        if(encrypting === 'file') return uint8ArrayData;
        
        const stringData = String.fromCharCode.apply(null, [].slice.call(uint8ArrayData));
        const encryptedBase64Data = btoa(stringData);

        return encryptedBase64Data;
    }
    catch (err) { console.log(err.message); };
}

const encryptFile = async (file: "" | File, filename: string, passkey: string) =>
  {
    try
    {
      (async () =>
        {
            const key = await deriveKey(passkey);

            const fileBytesArray = await fileToByteArray(file);
            const encryptedFileData = await encryptData(fileBytesArray as Uint8Array, 'file', key);

            const encodedFilename = new TextEncoder().encode(filename);
            const encryptedName = await encryptData(encodedFilename, 'name', key);

            const binFile = new Blob([encryptedFileData as BlobPart], { type: 'application/octet-stream' });
            saveAs(binFile, `${ encryptedName }`);
        }
      )();
    }
    catch (err) { console.log(err.message); };
  };

export default encryptFile;