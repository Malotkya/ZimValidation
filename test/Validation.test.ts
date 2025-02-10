import {test, expect} from '@jest/globals';
import * as Validation from "../src";

///////////////////////////// Optional Validator /////////////////////////////

test("Optional Primitive Value", ()=>{
    const test = Validation.optional(Validation.string());
    expect(test.run(undefined)).toBe(null);
    expect(test.run("Hello, World")).toBe("Hello, World");

    type value = Validation.TypeOf<typeof test>;
});

test("Optional Default Value", ()=>{
    const test = Validation.optional(Validation.time(), "5:00:PM");
    expect(test.run(null)).toBe("17:00");
});

test("Optional Empty String", ()=>{
    const test = Validation.optional(Validation.string());
    expect(test.run("")).toBe("");
    expect(test.run(undefined)).toBe(null);

    const testDefault = Validation.optional(Validation.string(), "Hello, World!");
    expect(testDefault.run("")).toBe("Hello, World!");
    expect(testDefault.run(" ")).toBe(" ");
    expect(testDefault.run(undefined)).toBe("Hello, World!");
});

test("Optional Stored Value", ()=>{
    const test = Validation.optional(Validation.color());
    expect(test.run(null)).toBe(null);
    expect(test.run("AAA")).toBe("#aaaaaa");
});

///////////////////////////// List Validator /////////////////////////////

test("List Primitive Value", ()=>{
    const test = Validation.list(Validation.number());
    expect(test.run("[]")).toEqual([]);
    expect(test.run([1, 2, 3])).toEqual([1, 2, 3]);

    type value = Validation.TypeOf<typeof test>;
});

test("List Default Value", ()=>{
    const test = Validation.list(Validation.date(), undefined, ["1970/1/1"]);
    expect(test.run(null)).toEqual(["1970-01-01"]);
});

test("List Stored Value", ()=>{
    const start = ["test@real.com"];
    const test = Validation.list(Validation.email(), undefined, start);
    expect(test.run(null)).toEqual(start);
    expect(test.run(["one@new.com", "two@new.com"])).not.toEqual(start);
    
});

test("List in String", ()=>{
    const test = Validation.list(Validation.boolean());
    expect(test.run('["true", "false", 1, 0, "24", 7, true, false]'))
        .toEqual([true, false, true, false, false, false, true, false]);
})

///////////////////////////// Object Validator /////////////////////////////

test("Default Object Value", ()=>{
    const test = Validation.object({
        name: Validation.string(),
        age: Validation.number(),
        email: Validation.email(),
        portfolio: Validation.optional(Validation.url())
    }, {
        name: "Alex",
        age: "32",
        email: "Alex@email.Com"
    });

    expect(test.run(null)).toEqual({
        name: "Alex",
        age: 32,
        email: "alex@email.com",
        portfolio: null
    });

    expect(test.run({
        age: 45
    })).toEqual({
        name: "Alex",
        age: 45,
        email: "alex@email.com",
        portfolio: null
    })

    type value = Validation.TypeOf<typeof test>;
});

test("Deep Object Values", ()=>{
    const test = Validation.object({
        list: Validation.list(Validation.number()),
        name: Validation.object({
            first: Validation.string(),
            last: Validation.string()
        }),
        birthday: Validation.date("2024-12-25")
    });

    expect(test.run({
        list: [3, 6, "7"],
        name: {
            first: "First Name",
            last: "Last Name"
        }
    })).toEqual({
        list: [3, 6, 7],
        name: {
            first: "First Name",
            last: "Last Name"
        },
        birthday: "2024-12-25"
    })

    type value = Validation.TypeOf<typeof test>;
});

test("Object in String", ()=>{
    const test = Validation.object({
        string: Validation.string(),
        number: Validation.number(),
        List: Validation.list(Validation.telephone())
    });

    expect(test.run(`{
        "string": 45,
        "number": false, 
        "List": [
            "1234567890"
        ]
    }`)).toEqual({
        string: "45",
        number: 0,
        List: [
            "(123) 456-7890"
        ]
    })
});