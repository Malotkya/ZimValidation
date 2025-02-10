/** /Complex/Record
 * 
 * @author Alex Malotky
 */
import Validator from "../Validator";
import { emptyHandler } from "../Empty";
import { objectify } from "./Object";

//Record Fromat Name
export const RecordName = "Record";

/** Record Validator
 * 
 */
export class RecordValidator<T> extends Validator<Record<string, T>> {
    constructor(type:Validator<T>, value?:Record<string, T>){
        if(value){
            try {
                value = buildRecord(type, value);
            } catch (e){
                throw new TypeError("Default value is not a Record!");
            }
        }

        super(RecordName, function formatRecord(input:unknown):Record<string,T> {
            return emptyHandler(input, ()=>buildRecord(type, objectify(input)), value);
        });
    }

    simplify(value: Record<string, T>):string {
        return JSON.stringify(value);
    }
}

/** Build Record
 * 
 * @param {TypeValidator}type 
 * @param {Record} value 
 * @returns {Record}
 */
function buildRecord<T>(type:Validator<T>, value:Record<string, unknown>):Record<string, T> {
    const output:Record<string, T> = {};

    for(const name in value) {
        try {
            output[name] = type.run(value[name]);
        } catch (e:any){
            throw new Error(`${e.message || String(e)} at ${name}`);
        }
        
    }

    return output;
}