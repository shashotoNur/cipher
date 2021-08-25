import { saveAs } from 'file-saver';
import deriveKey from 'utils/deriveKey';

const getFileData = (file: "" | File) =>
{
    return new Promise((resolve, _reject) =>
    {
        try
        {
            let reader = new FileReader();

            reader.readAsArrayBuffer(file as Blob);
            reader.onload = (event) => { event.target && resolve(event.target.result) };
        }
        catch (err) { console.log(err.message); };
    });
};

const decryptData = async (data: Uint8Array | string, key: CryptoKey | undefined) =>
{
    try {
        const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };

        if(typeof data !== 'string') return key && await window.crypto.subtle.decrypt(algorithm, key, data);

        const filteredData = data.replace('_', '/');

        const decodedBase64Filename = atob(filteredData);
        const uint8ArrayFilename = new Uint8Array(
          [...decodedBase64Filename].map(
            (char) => char.charCodeAt(0)
          )
        );

        const decryptedName = key && await window.crypto.subtle.decrypt(algorithm, key, uint8ArrayFilename)
        const originalFilename = new TextDecoder().decode(decryptedName);

        return originalFilename;
    }
    catch(err)
    {
        console.log(err.message);

        const extension = typeof data === 'string' && /[^.]*$/.exec(data)![0];
        return `original_name_could_not_be_recovered.${ extension }`;
    };
};

const decryptFile = async (file: "" | File, filename: string, passkey: string) =>
  {
    try
    {
      (async () =>
        {
            const key = await deriveKey(passkey);

            const fileUint8Array = await getFileData(file);
            const decryptedFileData = await decryptData(fileUint8Array as Uint8Array, key);

            const originalName = await decryptData(filename, key);

            const originalFile = new Blob( [decryptedFileData as BlobPart] );
            saveAs(originalFile, originalName as string);
        }
      )();
    }
    catch (err) { console.log(err.message); };
  };

export default decryptFile;