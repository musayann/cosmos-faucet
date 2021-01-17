"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("./tokens");
describe("tokens", () => {
    describe("parseBankToken", () => {
        it("works", () => {
            expect(tokens_1.parseBankToken("ucosm")).toEqual("ucosm");
        });
        it("allows using whitespace", () => {
            expect(tokens_1.parseBankToken(" ucosm\n")).toEqual("ucosm");
        });
    });
    describe("parseBankTokens", () => {
        it("works for one", () => {
            expect(tokens_1.parseBankTokens("ucosm")).toEqual(["ucosm"]);
        });
        it("works for two", () => {
            expect(tokens_1.parseBankTokens("ucosm,mstake")).toEqual(["ucosm", "mstake"]);
        });
        it("ignores whitespace", () => {
            expect(tokens_1.parseBankTokens("ucosm, mstake\n")).toEqual(["ucosm", "mstake"]);
        });
        it("ignores empty elements", () => {
            expect(tokens_1.parseBankTokens("ucosm,mstake,")).toEqual(["ucosm", "mstake"]);
        });
    });
});
//# sourceMappingURL=tokens.spec.js.map