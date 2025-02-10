/** /Stored/DateTime
 * 
 * @author Alex Malotky
 */
import Date, { formatDate, isDate } from "./Date";
import Time, { formatTime, isTime } from "./Time";
import Validator, { Simple } from "../Validator";
import { emptyHandler } from "../Empty";

// DateTime Type
type DateTime = string;
export default DateTime;

/** Format DateTime
 * 
 * Used to format / sanitize email input.
 * 
 * @param {unknown} value 
 * @returns {DateTime}
 */
export function formatDateTime(value:unknown):DateTime {
    if(typeof value !== "string")
        throw new TypeError("DateTime must be stored in a string!");

    const string = value.toLocaleUpperCase();

    let date:Date, time:Time;
    try {
        const index = string.indexOf("T");
    if(index === -1)
        throw new Error("Unable to find Date/Time seperator!");

        date = formatDate(string.substring(0, index));
        time = formatTime(string.substring(index+1));
    } catch (e){
        throw new TypeError("DateTime is not formated correctly!");
    }

    return date+"T"+time;
}

/** Is DateTime
 * 
 * @param {unknwon} value 
 * @returns {boolean}
 */
export function isDateTime(value:unknown):value is DateTime {
    if(typeof value === "string"){
        const a = value.split("T");
        return isDate(a[0]) && isTime(a[1]);
    }

    return false;
}

// DateTime Format Name
export const DateTimeName = "DateTime";

/** DateTime Type Validator
 * 
 */
export class DateTimeValidator extends Validator<DateTime> {
    constructor(value?:DateTime){
        if(value){
            try {
                value = formatDateTime(value)
            } catch (e){
                throw new TypeError(`${value} is not a valid DateTime!`);
            }
        }
        super(DateTimeName, (input:unknown)=>emptyHandler(input, formatDateTime, value));
    }

    simplify(value: DateTime): Simple {
            return value;
        }
}