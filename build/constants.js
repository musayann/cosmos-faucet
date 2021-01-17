"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenConfig = exports.addressPrefix = exports.mnemonic = exports.port = exports.concurrency = exports.gasLimits = exports.gasPrice = exports.memo = exports.binaryName = void 0;
const launchpad_1 = require("@cosmjs/launchpad");
const tokens_1 = require("./tokens");
exports.binaryName = "cosmos-faucet";
exports.memo = process.env.FAUCET_MEMO;
exports.gasPrice = launchpad_1.GasPrice.fromString(process.env.FAUCET_GAS_PRICE || "0.025ucosm");
exports.gasLimits = {
    send: parseInt(process.env.FAUCET_GAS_LIMIT || "80000", 10),
};
exports.concurrency = Number.parseInt(process.env.FAUCET_CONCURRENCY || "", 10) || 5;
exports.port = Number.parseInt(process.env.FAUCET_PORT || "", 10) || 8000;
exports.mnemonic = process.env.FAUCET_MNEMONIC;
exports.addressPrefix = process.env.FAUCET_ADDRESS_PREFIX || "cosmos";
exports.tokenConfig = {
    bankTokens: tokens_1.parseBankTokens(process.env.FAUCET_TOKENS || "ucosm, ustake"),
};
//# sourceMappingURL=constants.js.map