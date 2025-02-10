/** /Empty
 * 
 * @author Alex Malotky
 */
import Validator, { Format, Simple } from "./Validator";

//Empty Type
type Empty = null|undefined;
export default Empty;

 /** Format Color
 * 
 * @param value 
 */
export function formatEmpty(value:unknown):Empty {
    if(isEmpty(value) === false)
        throw new TypeError(`${value} is not empty!`);
        
    return null;
}

/** is Empty
 * 
 * @param {value} value 
 * @param {boolean} string
 * @returns {boolean}
 */
export function isEmpty(value:unknown, string:true):value is Empty|string
export function isEmpty(value:unknown): value is Empty
export function isEmpty(value:unknown, string:boolean = false):boolean {
    if(string && typeof value === "string"){
        return value === "";
    }
    
    return value === null || value === undefined;
}

/** Handle Empty Type
 * 
 * @param {unknown} value 
 * @param {string} name
 * @param {any} ifEmpty 
 * @returns {unknown}
 */
export function emptyHandler<T>(value:unknown, format:Format<T>, ifEmpty?:T):T {
    if(isEmpty(value, true)){
        if(ifEmpty === undefined)
            throw new EmptyError()

        return ifEmpty;
    }

    return format(value);
}

export class EmptyError extends Error {
    constructor(){
        super("Unexpected Empty Value!")
    }
};

//Empty Format Name
export const EmptyName = "Empty";

/** Empty Validator
 * 
 */
export class EmptyValidator extends Validator<Empty> {
    constructor() {
        super(EmptyName, formatEmpty);
    }

    simplify(value: Empty): Simple {
        return null;
    }
}


