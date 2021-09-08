
// The algorithm to encrypt the file using webcrypto
const getAlgorithm = (passkey: string) => 
{
    // Get a string of 12 chars from passkey
    const repetitons = Math.floor(12/passkey.length);
    const vector = ((repetitons === 0)
        ? passkey
        : passkey.repeat(repetitons + 1))
            .substring(0, 12);

    return { name: "AES-GCM", iv: new TextEncoder().encode(vector) };
};

export default getAlgorithm;