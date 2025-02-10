/** /Simple/String
 * 
 * @author Alex Malotky
 */
import Validator, { Simple } from "../Validator";
import { emptyHandler } from "../Empty";

/** String Validator
 * 
 */
export class StringValidator extends Validator<string> {
    constructor(value?:string){
        if(value)
            value = convertToString(value);

        super("String", function formatString(input:unknown):string {
            return emptyHandler<string>(input, convertToString, value);
        });
    }

    simplify(value: string): Simple {
        return value;
    }
}

/** Convert To String
 * 
 * @param {unknown} value 
 * @returns {string}
 */
function convertToString(value:unknown):string {
    switch(typeof value){
        case "object":
            return JSON.stringify(value);

        case "string":
            return value;

        default:
            return String(value);
    }
}