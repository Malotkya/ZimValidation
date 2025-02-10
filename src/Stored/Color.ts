/** /Stored/Color
 * 
 * @author Alex Malotky
 */
import Validator, { Simple } from "../Validator";
import { emptyHandler } from "../Empty";
const COLOR_REGEX = /^#?[0-9a-f]{6}$|^#?[0-9a-f]{3}$/;

//Color Type
type Color = string;
export default Color;

 /** Format Color
 * 
 * @param value 
 */
export function formatColor(value:unknown):Color {
    if(typeof value !== "string") 
        throw new TypeError("Color must be stored in a string!");

    let string = value.toLocaleLowerCase();
    if(string.match(COLOR_REGEX) === null)
        throw new TypeError("Color is not formated correctly!");

    switch(string.length){
        case 7:
            return string;

        case 6:
            return "#"+string;

        case 4:
            string = string.substring(1);
        case 3:
            const r = scaleHex(string.substring(0, 1));
            const g = scaleHex(string.substring(1, 2));
            const b = scaleHex(string.substring(2, 3));
            return "#"+r+g+b;
    }

    throw new TypeError("Color is not formated correctly!")
}

const CONVERTION_RATIO = 255 / 15;
function scaleHex(value:string):string {
    const oldValue = parseInt(value, 16);
    const newValue = Math.round(oldValue * CONVERTION_RATIO);
    return ("0"+newValue.toString(16)).slice(-2);
}

/** Is Color
 * 
 * @param {unknown} value 
 * @returns {boolean}
 */
export function isColor(value:unknown):value is Color {
    return typeof value === "string" && value.match(COLOR_REGEX) !== null;
}

//Color Name
export const ColorName = "Color";

/** Color Validator
 * 
 */
export class ColorValidator extends Validator<Color> {
    constructor(value?:Color){
        if(value){
            try {
                value = formatColor(value)
            } catch (e){
                throw new TypeError(`${value} is not a valid Color!`);
            }
        }

        super(ColorName, (input:unknown)=>emptyHandler(input, formatColor, value));
    }

    simplify(value: Color): Simple {
        return value;
    }
}