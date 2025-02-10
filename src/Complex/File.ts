/** /Complex/File
 * 
 * @author Alex Malotky
 */
import Validator, { Simple } from "../Validator";
import { isEmpty, EmptyError } from "../Empty";
const FILE_REGEX = /^data:([a-z\/;=-]+)(;base64)?,(.*?)$/i

// File Type
type File = Blob;
export default File;

/** String to Blob
 * 
 * Taken From: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
 * 
 * @param {string} dataURI 
 * @returns {Blob}
 */
function dataURIToBlob(dataURI:string):Blob{
    const match = dataURI.match(FILE_REGEX);
    if(match === null)
        throw new Error("String is not a DATA URI");

    const type = match[1];
    const base64 = match[2]
    const data = base64? atob(match[3]): unescape(match[3]);

    const array = new Uint8Array(data.length);
    for(let i=0; i<data.length; i++)
        array[i] = data.charCodeAt(i);

    return new Blob([array], {type});
}

/** Text String To Blob
 * 
 * @param {string} value 
 * @returns {Blob}
 */
function textToBlob(value:string):Blob {
    const array = new Uint8Array(value.length);

    for (let i=0; i<value.length; i++) {
        array[i] = value.charCodeAt(i);
    }

    return new Blob([array], {type:"text/plain"});
}

/** File Options
 * 
 */
export interface FileOptions {
    maxSize?:number,
    mimeType?:string,
}

/** Format File
 * 
 * Used to format / sanitize email input.
 * 
 * @param {unknown} value 
 * @param {FileOptions} opts - Comming Soon
 * @returns {Email}
 */
export function formatFile(value:unknown, opts:FileOptions = {}):File {
    if(isEmpty(value)){
        throw new EmptyError()
    }else if(typeof value === "string") {
        try {
            return dataURIToBlob(value);
        } catch (e){
            return textToBlob(value);
        }
        
    } else if( !(value instanceof Blob) ) {
        throw new TypeError("File must be stored in a Blob or string!");
    }
        
    return value;
}

//Email Format Type
export const FileName = "File";

/** File Validator
 * 
 */
export class FileValidator extends Validator<File> {
    constructor(opts?: FileOptions) {
        if(opts)
            console.warn("File options is not yet implimented!");
        
        super(FileName, (input:unknown)=>formatFile(input, opts));
    }

    async simplify(value: File):Promise<Simple> {
        let buffer = "";

        const bytes = await value.bytes();
        for(let i=0; i<bytes.length; i++) {
            buffer += String.fromCharCode(bytes[i])
        }

        return `data:${value.type};base64,${btoa(buffer)}`;
    }
}