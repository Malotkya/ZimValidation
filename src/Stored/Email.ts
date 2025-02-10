/** /Stored/Email
 * 
 * @author Alex Malotky
 */
import Validator, { Simple } from "../Validator";
import { emptyHandler } from "../Empty";
//Source: https://emailregex.com/
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

// Email Type
type Email = string;
export default Email;

/** Format Email
 * 
 * Used to format / sanitize email input.
 * 
 * @param {unknown} value 
 * @returns {Email}
 */
export function formatEmail(value:unknown):Email {
    if(typeof value !== "string")
        throw new TypeError("Email must be stored in a string!");

    const format = value.toLocaleLowerCase();
    if(format.match(EMAIL_REGEX) === null)
        throw new TypeError("Email is not formated correctly!")

    return format;
}

/** Is Email
 * 
 * @param {unknown} value 
 * @returns {boolean}
 */
export function isEmail(value:unknown):value is Email {
    return typeof value === "string" && value.match(EMAIL_REGEX) !== null;
}

// Email Format Name
export const EmailName = "Email"

/** Email Validator
 * 
 */
export class EmailValidator extends Validator<Email> {
    constructor(value?:Email) {
        if(value){
            try {
                value = formatEmail(value)
            } catch (e){
                throw new TypeError(`${value} is not a valid Email Address!`);
            }
        }
        super(EmailName, (input:unknown)=>emptyHandler(input, formatEmail, value))
    }

    simplify(value: Email): Simple {
        return value;
    }
}