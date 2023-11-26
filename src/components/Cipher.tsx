import React, { useState } from "react";

import logo from "logo.svg";

import encryptFile from "helpers/encryptFile";
import decryptFile from "helpers/decryptFile";

const Cipher = () => {
  const [file, setFile] = useState<"" | File>("");
  const [filename, setFilename] = useState("Choose A File");
  const [passkey, setPasskey] = useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files![0]) {
      setFile(event.target.files![0]);
      setFilename(event.target.files![0].name);
    }
  };

  const onKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasskey(event.target.value);
  };

  const clickFileInput = (event: React.KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === " " || event.key === "Enter")
      document.getElementById("file")?.click();
  };

  const encrypt = () => {
    if (file !== "" && passkey !== "") encryptFile(file, filename, passkey);
    else alert("Please provide a file and a passkey in order to encrypt!");
  };

  const decrypt = () => {
    if (file !== "" && passkey !== "") decryptFile(file, passkey);
    else alert("Please provide a file and a passkey in order to decrypt!");
  };

  return (
    <>
      <img src={logo} className="logo" alt="logo" />
      <h1> Cipher </h1>

      <div className="division">
        <hr />
      </div>
      <br />
      <br />
      <br />

      <div className="main">
        <form onSubmit={(event) => event.preventDefault()}>
          <div>
            <label
              htmlFor="file"
              id="file-label"
              tabIndex={0}
              onKeyPress={clickFileInput}
            >
              {file === ""
                ? "Choose a File"
                : `${filename.substring(0, 30)}${
                    filename.length > 30 ? "..." : ""
                  }`}
              <input
                type="file"
                id="file"
                name="file"
                onChange={onFileChange}
              />
            </label>
            <br />
            <br />
            <br />

            <label id="passkey-label" htmlFor="key">
              Passkey :
              <input
                type="text"
                id="key"
                name="key"
                onChange={onKeyChange}
                placeholder={passkey}
              />
            </label>
          </div>

          <input type="button" value="Encrypt" onClick={encrypt} />
          <input type="button" value="Decrypt" onClick={decrypt} />
        </form>

        <div className="instructions">
          <h2>Instructions:</h2>

          <ol>
            <li>Select a file.</li>
            <li>Write any passkey to encrypt/decrypt the file against.</li>
            <li>Encrypt or Decrypt your file. It's that easy!</li>
          </ol>

          <p>
            Note: Only the passkey used to encrypt a file can be used to decrypt
            the same.
          </p>
        </div>
        <br />

        <a href="https://github.com/shashotoNur/cipher">
          No copyrights &#128521;
        </a>
      </div>
    </>
  );
};

export default Cipher;
