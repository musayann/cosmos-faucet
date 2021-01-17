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
exports.createClients = exports.createWallets = void 0;
const crypto_1 = require("@cosmjs/crypto");
const launchpad_1 = require("@cosmjs/launchpad");
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const constants = __importStar(require("./constants"));
async function createWallets(mnemonic, addressPrefix, numberOfDistributors, stargate = true, logging = false) {
    const createWallet = stargate ? proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic : launchpad_1.Secp256k1HdWallet.fromMnemonic;
    const wallets = new Array();
    // first account is the token holder
    const numberOfIdentities = 1 + numberOfDistributors;
    for (let i = 0; i < numberOfIdentities; i++) {
        const path = launchpad_1.makeCosmoshubPath(i);
        const wallet = await createWallet(mnemonic, path, addressPrefix);
        const [{ address }] = await wallet.getAccounts();
        if (logging) {
            const role = i === 0 ? "token holder " : `distributor ${i}`;
            console.info(`Created ${role} (${crypto_1.pathToString(path)}): ${address}`);
        }
        wallets.push([address, wallet]);
    }
    return wallets;
}
exports.createWallets = createWallets;
async function createClients(apiUrl, wallets) {
    // we need one client per sender
    return Promise.all(wallets.map(async ([senderAddress, wallet]) => [
        senderAddress,
        proto_signing_1.isOfflineDirectSigner(wallet)
            ? await stargate_1.SigningStargateClient.connectWithSigner(apiUrl, wallet, {
                gasLimits: constants.gasLimits,
                gasPrice: constants.gasPrice,
            })
            : new launchpad_1.SigningCosmosClient(apiUrl, senderAddress, wallet, constants.gasPrice, constants.gasLimits),
    ]));
}
exports.createClients = createClients;
//# sourceMappingURL=profile.js.map