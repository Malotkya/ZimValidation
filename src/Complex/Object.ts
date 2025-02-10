/** /Complex/Object
 * 
 * @author Alex Malotky
 */
import { TypeOf } from "..";
import Validator, {Format} from "../Validator";
import { emptyHandler } from "../Empty";

type Object<P extends ObjectProperties> = {[K in keyof P]: TypeOf<P[K]>}
export default Object;

//Object Format Name
export const ObjectName = "Object";

export type ObjectProperties = Record<string, Validator<any>>;
export type ObjectDefaults<K extends string|number|symbol> = { [key in K]?:unknown }

/** Object Validator
 * 
 */
export class ObjectValidator<P extends ObjectProperties> extends Validator<Object<P>> {
    protected _props:P;
    private _default:ObjectDefaults<keyof P>|undefined;

    constructor(format:P, value?:ObjectDefaults<keyof P>, strict?:boolean) {
        if(value){
            if(typeof value !== "object")
                throw new TypeError("Default value is not an object!");

            value = buildObject(format, value);
        }

        super(ObjectName, (input:unknown) => emptyHandler(input, (v:unknown)=>buildObject(format, objectify(v), value, strict), <any>value));
        this._props = format;
        this._default = value;
    }

    simplify(value: { [K in keyof P]: TypeOf<P[K]>; }): string {
        return JSON.stringify(value);
    }

    clone(cloneDefault:boolean):ObjectValidator<P>
    clone(defaultValue?:ObjectDefaults<keyof P>):ObjectValidator<P>
    clone(value?:ObjectDefaults<keyof P>|boolean):ObjectValidator<P>{
        if(typeof value === "boolean") {
            if(value){
                value = this._default;
            } else {
                value = undefined
            }
        }

        return new ObjectValidator(this._props, value);
    }
}

/** Build Object
 * 
 * @param {ObjectProperties} props 
 * @param {Object} value 
 * @returns {Object}
 */
function buildObject<P extends ObjectProperties, K extends keyof P>(props:P, value:Record<string, unknown>, defaultValue:ObjectDefaults<K> = {}, strict:boolean = true):Object<P>{
    const output:Record<string, any> = {};
    const expected = Object.getOwnPropertyNames(props);

    for(const name in value){
        const index = expected.indexOf(name);
        if(index === -1){
            if(strict)
                throw new Error(`Unexpected value occured at ${name}!`);

            continue;
        }
        
        expected.splice(index, 1);    
        try {
            output[name] = props[name].run(value[name]);
        }  catch (e:any){
            throw new Error(`${e.message || String(e)} at ${name}`);
        }
    }

    for(const name of expected){
        try {
            output[name] = props[name].run(defaultValue[<K>name]);
        }  catch (e:any){
            throw new Error(`${e.message || String(e)} at ${name}`);
        }
        
    }

    return output as any;
}

/** Object Objectifier
 * 
 * @param {unkown} value 
 * @returns {Record<string, unknown>}
 */
export function objectify<P extends ObjectProperties>(value:unknown):Object<P> {
    switch (typeof value){
        case "string":
            return objectify(JSON.parse(value));

        case "object":
            if(Array.isArray(value))
                throw new TypeError(`Invalid object type: 'Array'!`);
            
            if(value === null)
                throw new TypeError(`Invalid object type: 'null'!`);
            
            return <any>value;

        default:
            throw new TypeError(`Invalid object type: '${typeof value}'!`);
    }
}