```
[Version]                    (string, Unencrypted)
[Salt]                       (16 bytes, Unencrypted) — for PBKDF2
[Header Nonce]               (12 bytes, Unencrypted) — for AES-GCM encryption of header

// -- User Metadata (Plaintext) --
[Hint Length]                (2 bytes, Unencrypted)
[Hint]                       (variable, Unencrypted)
[Description Length]         (2 bytes, Unencrypted)
[Description]                (variable, Unencrypted)

// -- Encrypted Header Block --
[Header Ciphertext Length]   (4 bytes, Unencrypted)
[Encrypted Header Block]     (variable, Encrypted with Header Nonce)
    └── [Filename Length]     (2 bytes)
        [Filename]            (variable)
        [Timestamp Length]    (2 bytes)
        [Timestamp]           (variable)

// -- File Content Info --
[Total Chunk Count]          (4 or 8 bytes, Unencrypted) — number of encrypted chunks

// -- File Data Stream (for each chunk) --
[Chunk Nonce]                (12 bytes, Unencrypted)
[Chunk Ciphertext Length]    (4 bytes, Unencrypted)
[Chunk Ciphertext]           (variable, Encrypted with Chunk Nonce)

//    Signature
[Signature]
[Signature Length]           (2 bytes, Unencrypted)
[Prefix Length]               (2 bytes, Unencrypted)
```

# Svelte library

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
