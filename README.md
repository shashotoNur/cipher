# Cipher

A react progressive web app written in typescript to encrypt/decrypt files against password in the browser.\
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

Clone the repo: `git clone https://github.com/shashoto-nur/cipher.git`\
Enter the project directory: `cd cipher`\
Install the necessary dependencies: `npm install`\
Run the project locally: `npm start`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run production`

Serves the build folder of the react app on localhost.
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

### `npm run deploy`

Builds the app for production to the `build` folder and deploys the build folder to github pages.

### `npm run package-update`

Run `npm install -g ncu` if you don't have ncu installed.\
Updates the dependency versions in the package.json of the project and installs the latest versions.\

### `npm run eject`

Copies all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

### Live Demo

You can view a live demo here as a [Github Page](https://shashoto-nur.github.io/cipher).

### Usage

1. Select a file.
2. Write any passkey to encrypt/decrypt the file against.
3. Encrypt or Decrypt your file. It's that easy!\
Note: Only the passkey used to encrypt a file can be used to decrypt the same.
