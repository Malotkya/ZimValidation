/** /Const
 * 
 * @author Alex Malotky
 */
import Validator, { Simple } from "./Validator";

export class ConstValidator<T> extends Validator<T> {
    constructor(value:T[]) {
        for(let subValue of value){
            switch (typeof subValue) {
                case "undefined":
                    throw new Error("Undefined cannot be a const value!");

                case "object":
                    throw new Error("An object cannot be a const value!");

                case "function":
                    throw new Error("A function cannot be a const value!");

                case "symbol":
                    throw new Error("A symbol cannot be a const value!");
            }
        }

        const name = value.join("|");

        super(name, function formatConst (input:unknown):T {

            let index = value.indexOf(input as T);
            if (index >= 0) {
                return value[index]
            } else {
                throw new TypeError(`${input} is not a part of ${name}!`);
            }
        })
    }

    simplify(value: T): Simple {
        return value as Simple
    }
}