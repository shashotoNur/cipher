
import logError from 'utils/logError';
import variables from 'env/variables';

// The algorithm to encrypt the file using webcrypto
const getAlgorithm = (passkey: string) => {
    try {
        // Get a string of IV_SIZE chars from passkey
        const repetitons = Math.floor(variables.IV_SIZE/passkey.length);
        const stringVector = ((repetitons === 0)
            ? passkey
            : passkey.repeat(repetitons + 1))
                .substring(0, variables.IV_SIZE);

        // Create a Uint8Array iv from string
        const bitVector = new TextEncoder().encode(stringVector);

        return { name: variables.ALGO, iv: bitVector };

    } catch ({ message }) { logError(message as string); };

};


export default getAlgorithm;