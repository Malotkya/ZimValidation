/** /Complex/List
 * 
 * @author Alex Malotky
 */
import Validator, {ValidationError} from "../Validator"
import { emptyHandler } from "../Empty";

type List<T> = T[];
export default List;

//List Format Name
export const ListName = "List";

/** List Validator
 * 
 */
export class ListValidator<T> extends Validator<List<T>> {
    private _seperator:string|undefined;

    constructor(type:Validator<T>, seperator?:string, value?:T[]){
        if(value){
            if(!Array.isArray(value))
                throw new TypeError("Default value is not a List!");

            value = value.map((v)=>type.run(v));
        }

        super(ListName, function formatList(input:unknown):List<T> {
            return emptyHandler(input, ()=>objectify(input, seperator).map((v, i)=>{
                try {
                    return type.run(v)
                } catch (e:any){
                    if(e instanceof ValidationError) {
                        e.addHistory(ListName, i);
                        throw e;
                    }
                    throw new ValidationError(ListName, `${e.message || String(e)}`, i);
                }
            }), value);
        });
        this._seperator = seperator;
    }

    simplify(value: List<T>): string {
        if(this._seperator === undefined) {
            return JSON.stringify(value);
        }
            
        return value.join(this._seperator);
    }
}

/** List Objectifier
 * 
 * @param {unkown} value 
 * @returns {Array<unknown>}
 */
function objectify(value:unknown, seperator:string|RegExp|null = null):unknown[] {
    switch(typeof value){
        case "string":
            if(seperator === null)
                return objectify(JSON.parse(value));
            else
                return value.split(seperator);

        case "object":
            if(Array.isArray(value))
                return value;

        default:
            throw new TypeError(`Invalid type list: '${value}'`);
    }
}