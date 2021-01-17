"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBankTokens = exports.parseBankToken = void 0;
const parseBankTokenPattern = /^([a-zA-Z]{2,20})$/;
function parseBankToken(input) {
    const match = input.replace(/\s/g, "").match(parseBankTokenPattern);
    if (!match) {
        throw new Error("Token could not be parsed");
    }
    return match[1];
}
exports.parseBankToken = parseBankToken;
function parseBankTokens(input) {
    return input
        .trim()
        .split(",")
        .filter((part) => part.trim() !== "")
        .map((part) => parseBankToken(part));
}
exports.parseBankTokens = parseBankTokens;
//# sourceMappingURL=tokens.js.map