"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAddress = void 0;
const encoding_1 = require("@cosmjs/encoding");
function isValidAddress(input, requiredPrefix) {
    try {
        const { prefix, data } = encoding_1.Bech32.decode(input);
        if (prefix !== requiredPrefix) {
            return false;
        }
        return data.length === 20;
    }
    catch (_a) {
        return false;
    }
}
exports.isValidAddress = isValidAddress;
//# sourceMappingURL=addresses.js.map