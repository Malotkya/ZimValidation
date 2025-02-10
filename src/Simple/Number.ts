/** /Simple/Number
 * 
 * @author Alex Malotky
 */
import Validator, { Simple } from "../Validator";
import { emptyHandler } from "../Empty";

/** Number Validator
 * 
 */
export class NumberValidator extends Validator<number> {
    constructor(value?:number){
        if(value)
            value = convertToNumber(value);

        super("Number", function formatNumber(input:unknown):number{
            return emptyHandler(input, convertToNumber, value);
        });
    }

    simplify(value: number): Simple {
        return value;
    }
}

/** Convert To Number;
 * 
 * @param {unknown} value 
 * @returns {number}
 */
function convertToNumber(value:unknown):number {
    const number = Number(value);
    
    if(isNaN(number))
        throw new TypeError(`Invalid number '${value}'!`);

    return number
}
