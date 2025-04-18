/** /Validatior
 * 
 * @author Alex Malotky
 */

/** Format Type Function
 * 
 */
export type Format<T> = (value:unknown)=>T;

/** Simple Type
 * 
 * Used for Insertion into SQL
 */
export type Simple = string|boolean|number|null;

/** Type Validator Abstract Class
 * 
 */
export default abstract class Validator<T> {
    private _name:string;
    private _format:Format<T>;
    readonly _type:T = null as any;

    /** Default Constructor
     * 
     * @param {string} name 
     * @param {Format} format 
     */
    constructor(name:string, format:Format<T>) {
        this._name = name;
        this._format = format;
    }

    /** Value Name
     * 
     */
    get name():string {
        return this._name;
    }

    /** Run Validator
     * 
     * @param {unknown} value 
     * @returns {T}
     */
    run(value:unknown):T {
        try {
            return this._format(value);
        } catch (e:any){
            if(e instanceof ValidationError)
                throw e;
            throw new ValidationError(this._name, e.message || String(e))
        }
    }

    abstract simplify(value:T):Simple|Promise<Simple>;
}

/** Custom Validation Error
 * 
 */
export class ValidationError extends Error {
    #name:string;

    constructor(name:string, message:string, history?:string|number){
        super(message);
        this.#name = name;
        this.name = `ValidationError [${name}]`;
        if(history)
            this.addHistory(name, history);
    }

    addHistory(name:string, index:number|string) {
        const value = typeof index === "string"
            ? `${name}['${index}']`
            : `${name}[${index}]`;
        
        
        const buffer = this.message.split("\n  ");
        if(buffer.length > 1){
            buffer[1] = value + " -> " + buffer[1];
        } else {
            buffer.push(value + " -> " + this.#name);
        }
        this.message = buffer.join("\n  ");
    }


}

//Get Type From Validator
export type TypeOf<V extends Validator<any>> = V["_type"];