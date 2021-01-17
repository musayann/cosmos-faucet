"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const crypto_1 = require("@cosmjs/crypto");
const constants = __importStar(require("../constants"));
const profile_1 = require("../profile");
async function generate(args) {
    if (args.length > 0) {
        console.warn(`Warning: ${constants.binaryName} generate does not require positional arguments anymore. Use env variables FAUCET_ADDRESS_PREFIX or FAUCET_CONCURRENCY to configure how accounts are created.`);
    }
    const mnemonic = crypto_1.Bip39.encode(crypto_1.Random.getBytes(16)).toString();
    console.info(`FAUCET_MNEMONIC="${mnemonic}"`);
    // Log the addresses
    await profile_1.createWallets(mnemonic, constants.addressPrefix, constants.concurrency, true);
}
exports.generate = generate;
//# sourceMappingURL=generate.js.map