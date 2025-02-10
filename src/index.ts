/** /
 * 
 * @author Alex Malotky
 */
import Validator, {TypeOf, Simple} from "./Validator";
import { BooleanValidator } from "./Simple/Boolean";
import { NumberValidator } from "./Simple/Number";
import { StringValidator } from "./Simple/String";
import Empty, { EmptyValidator, isEmpty } from "./Empty";
import Color,     {ColorValidator} from "./Stored/Color";
import Date,      {DateValidator} from "./Stored/Date";
import DateTime,  {DateTimeValidator} from "./Stored/DateTime";
import Email,     {EmailValidator} from "./Stored/Email";
import Telephone, {TelephoneValidator} from "./Stored/Telephone";
import Time,      {TimeValidator} from "./Stored/Time";
import Url,       {UrlValidator} from "./Stored/Url";
import List, { ListValidator } from "./Complex/List";
import File, { FileValidator } from "./Complex/File";
import { RecordValidator } from "./Complex/Record";
import Optional, { OptionalValidator } from "./Complex/Optional";
import Object, { ObjectValidator, ObjectProperties, ObjectDefaults } from "./Complex/Object";

//Passthrough Exports
export {Validator, isEmpty};
export type {Empty, Color, Date, DateTime, Email, Telephone, Time, Url, List, File, Optional, Object, TypeOf, Simple};

//Basic Helper Functions
export function boolean  (defaultValue?:boolean)  { return new BooleanValidator(defaultValue) };
export function number   (defaultValue?:number)   { return new NumberValidator(defaultValue) };
export function string   (defaultValue?:string)   { return new StringValidator(defaultValue) };
export function empty    () { return new EmptyValidator() };

//Stored Helper Functions
export function color    (defaultValue?:Color)    { return new ColorValidator(defaultValue) };
export function date     (defaultValue?:Date)     { return new DateValidator(defaultValue) };
export function datetime (defaultValue?:DateTime) { return new DateTimeValidator(defaultValue) };
export function email    (defaultValue?:Email)    { return new EmailValidator(defaultValue) };
export function telephone(defaultValue?:Telephone){ return new TelephoneValidator(defaultValue) };
export function time     (defaultValue?:Time)     { return new TimeValidator(defaultValue) };
export function url      (defaultValue?:Url)      { return new UrlValidator(defaultValue) };

//Complex Helper Functions
export function list<T>(type:Validator<T>, seperator?:string, defaultValue?:List<T>):ListValidator<T>{
    return new ListValidator(type, seperator, defaultValue)
}
export function object<P extends ObjectProperties>(properties:P, defaultValue?:ObjectDefaults<keyof P>):ObjectValidator<P> {
    return new ObjectValidator(properties, defaultValue);
}
export function optional<T>(type:Validator<T>, defaultValue?:T|null):OptionalValidator<T> {
    return new OptionalValidator(type, defaultValue)
}
export function record<T>(type:Validator<T>, defaultValue?:Record<string, T>) {
    return new RecordValidator(type, defaultValue);
}
export function file() { return new FileValidator() };
