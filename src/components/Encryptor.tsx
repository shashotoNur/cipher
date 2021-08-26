import React, { useState } from 'react';

import encryptFile from 'utils/encryptFile';
import decryptFile from 'utils/decryptFile';


const Encryptor = () =>
  {
    const [file, setFile] = useState<"" | File>('');
    const [filename, setFilename] = useState('Choose A File');
    const [passkey, setPasskey] = useState('Enter A Passkey');

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        setFile(event?.target?.files![0] ? event.target.files![0] : '');
        setFilename(event?.target?.files![0] ? event.target.files![0].name : 'Choose File');
    };

    const onKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => { setPasskey(event.target.value); };

    const encrypt = () =>
    {
        if(file !== '' && passkey !== 'Enter A Passkey') encryptFile(file, filename, passkey);
        else alert('Please provide a file and a passkey in order to encrypt!');
    };

    const decrypt = () =>
    {
        if(file !== '' && passkey !== 'Enter A Passkey') decryptFile(file, passkey);
        else alert('Please provide a file and a passkey in order to decrypt!');
    };

    return (
        <>
            <h1> Encryptor </h1>
            <br /><hr /><br />

            <form onSubmit={ (event) => event.preventDefault() }>
                <div>
                    <label htmlFor="file">File: </label>
                    <input type='file' id="file" name="file" onChange={ onFileChange } />
                    <br />

                    <label htmlFor="key">Passkey: </label>
                  <input type='text' id="key" name="key" onChange={ onKeyChange } placeholder={ passkey } />
                </div>

                <input type='button' value='Encrypt' onClick={ encrypt } />
                <input type='button' value='Decrypt' onClick={ decrypt } />
            </form>

            <br /><br />

            <h3>Instructions:</h3>
            <ol>
                <li>Select a file.</li>
                <li>Write any passkey to encrypt/decrypt the file against.</li>
                <li>Press any of the button to perform the operation you wish to perform.</li>
            </ol>

            <p>Note: Only the passkey used to encrypt a file can be used to decrypt the same.</p>
            <br />

            No copyrights &#128521;
        </>
    );
  };


export default Encryptor;