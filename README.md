# Cipher

<p align="center">
  <img src="./static/icons/android-chrome-192x192.png" width="192" height="192" alt="Cipher logo"/>
</p>

**Cipher** is a fully client-side file encryption and decryption tool built with **Vite** and **Svelte** in **Typescript**, leveraging the **Web Crypto API** for secure, efficient, and private processing of files entirely in the browser. It supports drag-and-drop or manual selection of multiple files and directories, and includes password-based authentication, progress tracking, metadata embedding, and integrity verification.

---

## Features

- Encrypt and decrypt **multiple files or entire directories**
- **Client-side only** — no server, no uploads
- Supports **drag-and-drop** or manual file selection
- Password-based key derivation using **PBKDF2**
- **Password generator**, visibility toggle, and weak-password blocking (can be disabled)
- Embed **password hint** and **file description** (stored unencrypted)
- Encrypt and store file **name** and **timestamp** for secrecy
- Display encryption/decryption **progress** and **estimated time remaining**
- Ensure file integrity with **password-based digital signature**
- Automatically verify files before decryption; show failures and allow selective removal
- Fully **offline capable** as a Progressive Web App (PWA)

---

## Encrypted File Structure

```
[Version]                    (string, Unencrypted)
[Salt]                       (16 bytes, Unencrypted) — for PBKDF2
[Header Nonce]               (12 bytes, Unencrypted) — for AES-GCM

-- User Metadata (Plaintext) --
[Hint Length]                (2 bytes)
[Hint]                       (variable)
[Description Length]         (2 bytes)
[Description]                (variable)

-- Encrypted Header Block --
[Header Ciphertext Length]   (4 bytes)
[Encrypted Header Block]     (variable, AES-GCM Encrypted)
    └── [Filename Length]     (2 bytes)
        [Filename]            (variable)
        [Timestamp Length]    (2 bytes)
        [Timestamp]           (variable)

-- File Content Info --
[Total Chunk Count]          (4 or 8 bytes)

-- Chunked Encrypted Data --
[Chunk Nonce]                (12 bytes per chunk)
[Chunk Ciphertext Length]    (4 bytes)
[Chunk Ciphertext]           (variable)

-- Digital Signature --
[Signature]
[Signature Length]           (2 bytes)
[Prefix Length]              (2 bytes)
```

---

## File Verification

Before decryption:

- The app extracts and displays the **password hint** and **description**
- Each file is **verified using a digital signature**
- If any file fails verification, the user can choose to:
  - Remove failed files
  - Proceed with all files anyway

---

## Getting Started (Development)

```bash
git clone https://github.com/shashotoNur/cipher.git
cd cipher
npm install
npm run dev
```

---

## Build for Production

```bash
npm run build
```

---

## Deployment

The app is hosted via **GitHub Pages**: **[Cipher](https://shashotoNur.github.io/cipher)**

---

## License

This project is licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---
