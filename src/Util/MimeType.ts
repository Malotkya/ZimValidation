
/** Mime Type Class
 * 
 * https://en.wikipedia.org/wiki/Media_type
 */
export default class MimeType {
    readonly type:string;
    readonly subtype:string;
    readonly params:Readonly<Record<string, undefined|string>>;
    #value:string;
    
    constructor(string:string){
        let index = string.indexOf("/");
        if(index === -1)
            throw new Error("Mimetype missing '/'!");

        this.type = string.substring(0, index);
        if(this.type.length === 0)
            throw new Error("Invalid Type!");

        string = string.substring(index+1);

        index = string.indexOf(";");
        if(index === -1){
            this.subtype = string;
            this.params = {};
        } else {
            this.subtype = string.substring(0, index);
            const builder:Record<string, string> = {};
            for(const param of string.substring(index).split(";")) {
                const [key, value="true"] = param.split("=");
                builder[key] = value;
            }
            this.params = builder;
        }

        if(this.subtype.length === 0)
            throw new Error("Invlaid Sub Type");

        this.#value = string;
    }

    /** Validate Mime Type
     * 
     * @param {string} value 
     * @returns {boolean}
     */
    validate(value:string):boolean {
        const test = value.split("/");
        if(test.length === 1 || test[1] === "*") {
            return this.type === test[0];
        }

        return this.type === test[0] && this.subtype === test[1];
    }

    /** Value
     * 
     */
    get value():string {
        return this.type + "/" + this.subtype
    }

    /** To String
     * 
     * @returns {string}
     */
    toString():string {
        return this.#value;
    }
}