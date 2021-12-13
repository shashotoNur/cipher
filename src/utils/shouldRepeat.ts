
import logError from 'utils/logError';
import variables from 'env/variables';


const shouldRepeat = (fileSize: number, end: number) => {
    try {
        if(fileSize > end) {
            const newEnd = end + variables.CHUNK_SIZE;
            const start = end; end = fileSize > newEnd ? newEnd : fileSize;

            return [true, start, end];

        } else return [false, undefined, undefined];

    } catch ({ message }) {
        logError(message as string);
        return [false, undefined, undefined];

    };

};


export default shouldRepeat;