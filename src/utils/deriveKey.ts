
import logError from 'utils/logError';
import variables from 'env/variables';

const deriveKey = async (passkey: string) => {
    try {
        // Derive a key from the password key
        const getKey = (cryptoKey: CryptoKey) => {

            return window.crypto.subtle.deriveKey(
                {
                    "name": variables.KEY_ALGO, "salt": new TextEncoder().encode('salt'),
                    "iterations": variables.KEY_ITER, "hash": variables.KEY_HASH
                },
                cryptoKey,
                { "name": variables.ALGO, "length": variables.KEY_LEN },
                true,
                [ "encrypt", "decrypt" ]
            );
        };

        // Create a cryptoKey key containing the passkey
        const cryptoKey = await window.crypto.subtle.importKey(
                "raw", new TextEncoder().encode(passkey),
                { "name": variables.KEY_ALGO }, false, [ "deriveKey" ]
        );

        const key = getKey(cryptoKey);
        return key;

    } catch ({ message }) { logError(message as string); };

};

export default deriveKey;