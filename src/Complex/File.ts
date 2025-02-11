/** /Complex/File
 * 
 * @author Alex Malotky
 */
import Validator from "../Validator";
import { isEmpty, EmptyError } from "../Empty";
import MimeType from "../Util/MimeType";
import {base64ArrayBuffer} from "../Util";

//https://en.wikipedia.org/wiki/Data_URI_scheme
const FILE_REGEX = /^data:([\w\/=\-+;]+),(.*?)$/

const PLAIN_TEXT = new MimeType("text/plain");

// File Type
type File = Blob&{
    fileName?:string,
    encoding?:string
};
export default File;

/** File Error
 * 
 */
class FileError extends Error{};

/** File Options
 * 
 */
export interface FileOptions {
    maxSize?:number,
    mimeType?:string,
}

/** String to Blob
 * 
 * @param {string} dataURI 
 * @returns {Blob}
 */
function dataURIToBlob(dataURI:string, opts:FileOptions):File{
    const match = dataURI.match(FILE_REGEX);
    if(match === null)
        throw new Error("String is not a DATA URI");

    const type = new MimeType(match[1]);

    if(opts.mimeType && type.validate(opts.mimeType))
        throw new FileError(`Type '${type}' does not match '${opts.mimeType}'!`)

    const data = type.params["base64"]? atob(match[2]): decodeURIComponent(match[2]);

    if(opts.maxSize && opts.maxSize < data.length)
        throw new FileError(`'${data.length}' is larger then max size '${opts.maxSize}'!`);

    const array = new Uint8Array(data.length);
    for(let i=0; i<data.length; i++)
        array[i] = data.charCodeAt(i);

    const file:File = new Blob([array], {type: type.value});
    file.encoding = type.params["encoding"];

    return file;
}

/** Text String To Blob
 * 
 * @param {string} value 
 * @returns {Blob}
 */
function textToBlob(value:string, opts:FileOptions):File {
    if(opts.mimeType && PLAIN_TEXT.validate(opts.mimeType))
        throw new FileError(`Type 'text/plain' does not match '${opts.mimeType}'!`);

    if(opts.maxSize && opts.maxSize < value.length)
        throw new FileError(`'${value.length}' is larger then max size '${opts.maxSize}'!`);

    const array = new TextEncoder().encode(value);
    return new Blob([array], {type:"text/plain"});;
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
            return dataURIToBlob(value, opts);
        } catch (e){
            if(e instanceof FileError)
                throw e;

            return textToBlob(value, opts);
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
        super(FileName, (input:unknown)=>formatFile(input, opts));
    }

    async simplify(value: File):Promise<string> {
        return `data:${value.type};base64,${base64ArrayBuffer(await value.arrayBuffer())}`;
    }
}