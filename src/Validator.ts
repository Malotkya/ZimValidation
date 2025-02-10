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
            throw new ValidationError(this._name, e.message || String(e))
        }
    }

    abstract simplify(value:T):Simple|Promise<Simple>;
}

/** Custom Validation Error
 * 
 */
export class ValidationError extends Error {
    constructor(name:string, message:string){
        super(`${name} Validation Error: ${message}`);
    }
}

//Get Type From Validator
export type TypeOf<V extends Validator<any>> = V["_type"];