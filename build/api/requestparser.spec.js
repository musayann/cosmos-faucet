"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestparser_1 = require("./requestparser");
describe("RequestParser", () => {
    it("can process valid credit request with denom", () => {
        const body = { address: "abc", denom: "utkn" };
        expect(requestparser_1.RequestParser.parseCreditBody(body)).toEqual({ address: "abc", denom: "utkn" });
    });
    it("throws helpful error message when ticker is found", () => {
        const oldBody = { address: "abc", ticker: "TKN" };
        expect(() => requestparser_1.RequestParser.parseCreditBody(oldBody)).toThrowError(/The 'ticker' field was removed in CosmJS 0.23. Please use 'denom' instead./i);
        const confusedBody = { address: "abc", ticker: "TKN", denom: "utkn" };
        expect(() => requestparser_1.RequestParser.parseCreditBody(confusedBody)).toThrowError(/The 'ticker' field was removed in CosmJS 0.23. Please use 'denom' instead./i);
    });
    it("throws for invalid credit requests", () => {
        // body not a dictionary
        {
            expect(() => requestparser_1.RequestParser.parseCreditBody("foo")).toThrowError(/Request body must be a dictionary./i);
            expect(() => requestparser_1.RequestParser.parseCreditBody(null)).toThrowError(/Request body must be a dictionary./i);
            expect(() => requestparser_1.RequestParser.parseCreditBody(42)).toThrowError(/Request body must be a dictionary./i);
            expect(() => requestparser_1.RequestParser.parseCreditBody([])).toThrowError(/Request body must be a dictionary./i);
            expect(() => requestparser_1.RequestParser.parseCreditBody(true)).toThrowError(/Request body must be a dictionary./i);
            expect(() => requestparser_1.RequestParser.parseCreditBody(undefined)).toThrowError(/Request body must be a dictionary./i);
        }
        // address unset
        {
            const body = { denom: "utkn" };
            expect(() => requestparser_1.RequestParser.parseCreditBody(body)).toThrowError(/Property 'address' must be a string/i);
        }
        // address wrong type
        {
            const body = { address: true, denom: "utkn" };
            expect(() => requestparser_1.RequestParser.parseCreditBody(body)).toThrowError(/Property 'address' must be a string/i);
        }
        // address empty
        {
            const body = { address: "", denom: "utkn" };
            expect(() => requestparser_1.RequestParser.parseCreditBody(body)).toThrowError(/Property 'address' must not be empty/i);
        }
        // denom unset
        {
            const body = { address: "abc" };
            expect(() => requestparser_1.RequestParser.parseCreditBody(body)).toThrowError(/Property 'denom' must be a string/i);
        }
        // denom wrong type
        {
            const body = { address: "abc", denom: true };
            expect(() => requestparser_1.RequestParser.parseCreditBody(body)).toThrowError(/Property 'denom' must be a string/i);
        }
        // denom empty
        {
            const body = { address: "abc", denom: "" };
            expect(() => requestparser_1.RequestParser.parseCreditBody(body)).toThrowError(/Property 'denom' must not be empty/i);
        }
    });
});
//# sourceMappingURL=requestparser.spec.js.map