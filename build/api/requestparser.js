"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParser = void 0;
const utils_1 = require("@cosmjs/utils");
const httperror_1 = require("./httperror");
class RequestParser {
    static parseCreditBody(body) {
        if (!utils_1.isNonNullObject(body) || Array.isArray(body)) {
            throw new httperror_1.HttpError(400, "Request body must be a dictionary.");
        }
        const { address, denom, ticker } = body;
        if (typeof ticker !== "undefined") {
            throw new httperror_1.HttpError(400, "The 'ticker' field was removed in CosmJS 0.23. Please use 'denom' instead.");
        }
        if (typeof address !== "string") {
            throw new httperror_1.HttpError(400, "Property 'address' must be a string.");
        }
        if (address.length === 0) {
            throw new httperror_1.HttpError(400, "Property 'address' must not be empty.");
        }
        if (typeof denom !== "string") {
            throw new httperror_1.HttpError(400, "Property 'denom' must be a string.");
        }
        if (denom.length === 0) {
            throw new httperror_1.HttpError(400, "Property 'denom' must not be empty.");
        }
        return {
            address: address,
            denom: denom,
        };
    }
}
exports.RequestParser = RequestParser;
//# sourceMappingURL=requestparser.js.map