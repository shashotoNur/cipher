import logError from 'utils/logError';

const deriveKey = async (passkey: string) =>
{
    try
    {
        // Create a PBKDF2 key containing the passkey
        const pbkdf2Key = await window.crypto.subtle.importKey(
                "raw", new TextEncoder().encode(passkey),
                {"name": "PBKDF2"}, false, ["deriveKey"]
        );

        // Derive a key from the password key
        const getKey = (passwordKey: CryptoKey) =>
        {
            return window.crypto.subtle.deriveKey({
                    "name": "PBKDF2", "salt": new TextEncoder().encode('salt'),
                    "iterations": 1000, "hash": 'SHA-256'
                },
                passwordKey,
                { "name": "AES-GCM", "length": 128 },
                true,
                [ "encrypt", "decrypt" ]
            );
        };

        const key = getKey(pbkdf2Key);

        return key;
    }
    catch ({ message }) { logError(message as string); };
};


export default deriveKey;