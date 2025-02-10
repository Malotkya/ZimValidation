/** /Simple/Boolean
 * 
 * @author Alex Malotky
 */
import Validator, { Simple } from "../Validator";
import { EmptyError } from "../Empty";

/** Boolean Validator
 * 
 */
export class BooleanValidator extends Validator<boolean> {
    constructor(value?:boolean){
        if(value)
            value = convertToBoolean(value);

        super("Boolean", function formatBoolean(input:unknown):boolean {

            if(input === undefined) {
                if(value === undefined)
                    throw new EmptyError();
    
                return value;
            } else if(input === null){
                return value || false;
            }

            return convertToBoolean(input);
        });
    }

    simplify(value: boolean): Simple {
        return value;
    }
}

/** Convert To Boolean
 * 
 * @param {unknown} value 
 * @returns {boolean}
 */
function convertToBoolean(value:unknown):boolean {
    switch (typeof value){
        case "string":
            return value.toLocaleLowerCase() === "true" || value === "1";

        case "bigint":
            value = Number(value);
        case "number":
            return value === 1;

        case "boolean":
            return value;

        case "object":
            if(value === null) {
                return false;
            }
        
        default:
            throw new TypeError(`Invalid type '${typeof value}' for Boolean!`);
    }
}

