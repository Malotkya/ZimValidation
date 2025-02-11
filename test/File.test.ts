import {test, expect} from '@jest/globals';
import MimeType from '../src/Util/MimeType';
import {expectError} from "./Types.test";
import { FileValidator } from '../src';
import path from "path";
import fs from "fs";

///////////////////////////// Mime Types /////////////////////////////
test("Mime Type Params", ()=>{
    const type = new MimeType("text/plain;charset=UTF-8;base64")
    
    expect(type.params["charset"]).toBe("UTF-8");
    expect(type.params["base64"]).toBe("true");
});

test("Invalid Mime Strings", ()=>{
    expectError(()=>new MimeType(""), Error);
    expectError(()=>new MimeType("iamge-jpeg"), Error);
    expectError(()=>new MimeType("/"), Error);
    expectError(()=>new MimeType("image/"), Error);
    expectError(()=>new MimeType("image/;base64"), Error);
});

test("Mime Type Validation", ()=>{
    expect(new MimeType("image/png").validate("image")).toBe(true);
    expect(new MimeType("image/png").validate("png")).toBe(false);
    expect(new MimeType("text/plain").validate("text")).toBe(true);
    expect(new MimeType("text/plain").validate("plain")).toBe(false);
});

///////////////////////////// File Convertions /////////////////////////////
const validator = new FileValidator();
test("Text Blobs", async()=>{
    const value ="Hello, World!";
    const test = Buffer.from(value).toString("base64");
    const file = validator.run(value);

    expect( (await file.text()).includes(value)).toBe(true);
    expect((await validator.simplify(file)).includes(test)).toBe(true);
});

test("Data URI Blob", async()=>{
    const imgFile  = path.join(__dirname, "file", "Smile.png");
    const imageBuffer = fs.readFileSync(imgFile);

    const test = `data:image/png;base64,${imageBuffer.toString("base64")}`;
    const file = validator.run(test);

    expect(await validator.simplify(file)).toEqual(test);
})