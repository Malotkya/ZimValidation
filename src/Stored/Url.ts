/** /Stored/Url
 * 
 * @author Alex Malotky
 */
import Validator, { Simple } from "../Validator";
import { emptyHandler } from "../Empty";
//Help from: https://stackoverflow.com/questions/7109143/what-characters-are-valid-in-a-url
const URL_REGEX = /^(https?):\/\/([a-z0-9.][a-z0-9-.]+[a-z0-9.])(:\d{1,5})?(\/[a-z0-9.\-\/_~\!$&'\(\)*+,;=:@]*)?(#[a-zA-Z\-._~:\/#\[\}@!$&'\(\)*+,:%=]+)?(\?[a-zA-Z\-._~:\/#\[\}@!$&'\(\)*+,:%=]+)?/i;

// Url Type
type Url = string;
export default Url;

/** Format Url
 * 
 * Used to format / sanitize email input.
 * 
 * @param {unknwon} value 
 * @returns {Url}
 */
export function formatUrl(value:unknown):Url {
    if(typeof value !== "string")
        throw new TypeError("Url must be stored in a string!");

    const {protocol, domain, port, path, hash, search} = split(value);
    return protocol+"://"+domain+port+path+hash+search;
}

export function split(value:string):{protocol:string, domain:string, port:string, path:string, hash:string, search:string}{
    const match = value.match(URL_REGEX);
    if(match === null)
        throw new TypeError("Url is not formated correctly!");

    return {
        protocol: match[1].toLocaleLowerCase(),
        domain: match[2].toLocaleLowerCase(),
        port: match[3] || "",
        path: match[4] || "",
        hash: match[5] || "",
        search: match[6] || ""
    }
}

/** Validate Url
 * 
 * @param {unknwon} value 
 * @returns {boolean}
 */
export function isUrl(value:unknown):value is Url {
    return typeof value === "string" && value.match(URL_REGEX) !== null;
}

//Url Format Name
export const UrlName = "Url";

/** Url Validator
 * 
 */
export class UrlValidator extends Validator<Url> {
    constructor(value?:Url){
        if(value){
            try {
                value = formatUrl(value)
            } catch (e){
                throw new TypeError(`${value} is not a valid Url!`);
            }
        }

        super(UrlName, (input:unknown)=>emptyHandler(input, formatUrl, value))
    }

    simplify(value: Url): Simple {
        return value;
    }
}
