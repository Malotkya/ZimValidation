/** /Complex/Optional
 * 
 * @author Alex Malotky
 */
import Validator, {Simple} from "../Validator";
import Empty, { isEmpty } from "../Empty";

type Optional<T> = T|Empty;
export default Optional;

//Optional Format Name
export const OptionalName = "Optional";

/** Optional Validator
 * 
 */
export class OptionalValidator<T> extends Validator<Optional<T>> {
    private _proto:Validator<T>;

    constructor(type:Validator<T>, value:Optional<T> = null) {
        if(value){
            value = type.run(value);
        }
        super(OptionalName, function formatOptional(input:unknown):Optional<T> {
            if( isEmpty(input, true) ){
                if(isEmpty(value) && typeof input === "string")
                    return <T>input;

                return value;
            }
    
            return type.run(input);
        });
        this._proto = type;
    }

    simplify(value: Optional<T>):Simple|Promise<Simple> {
        if(value)
            return this._proto.simplify(value);

        return null;
    }
}