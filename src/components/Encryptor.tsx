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

    const encrypt = () => { encryptFile(file, filename, passkey); };
    const decrypt = () => { decryptFile(file, filename, passkey); };

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

        <br />
      </>
    );
  };

export default Encryptor;