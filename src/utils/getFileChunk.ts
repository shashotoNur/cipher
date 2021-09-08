
const reader = new FileReader();

// Get the binary file data
const getFileChunk = (file: File, start: number, end: number) =>
{
    return new Promise((resolve, _reject) =>
    {
        try
        {
            // Specify a slice
            const chunk = file.slice(start, end);

            reader.readAsArrayBuffer(chunk);
            reader.onloadend = (event) =>
            {
                if(event.target && event.target.readyState === FileReader.DONE)
                {
                    const arrayBufferChunk = event.target.result;
                    const uint8Chunk = new Uint8Array(arrayBufferChunk as ArrayBufferLike);

                    resolve(uint8Chunk);
                };
            };
        }
        catch ({ message })
        {
            console.log(message);
            alert('Operation failed! Please try again...');
        };
    });
};


export default getFileChunk;