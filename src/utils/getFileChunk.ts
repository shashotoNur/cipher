
import logError from 'utils/logError';

const reader = new FileReader();

// Get the binary file data
const getFileChunk = (file: File, start: number, end: number) => {

    return new Promise((resolve, _reject) => {
        try {
            // Get a chunk from the full file
            const chunk = file.slice(start, end);

            // Read the chunk
            reader.readAsArrayBuffer(chunk);

            reader.onloadend = event => {
                if(event.target && event.target.readyState === FileReader.DONE)
                {
                    const arrayBufferChunk = event.target.result;
                    const uint8Chunk = new Uint8Array(arrayBufferChunk as ArrayBufferLike);

                    // Return the Uint8Array of the chunk
                    resolve(uint8Chunk);
                };
            };

        } catch ({ message }) { logError(message as string); };

    });

};


export default getFileChunk;