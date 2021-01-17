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
exports.start = void 0;
const launchpad_1 = require("@cosmjs/launchpad");
const stargate_1 = require("@cosmjs/stargate");
const webserver_1 = require("../api/webserver");
const constants = __importStar(require("../constants"));
const debugging_1 = require("../debugging");
const faucet_1 = require("../faucet");
async function start(args) {
    if (args.length < 1) {
        throw Error(`Not enough arguments for action 'start'. See '${constants.binaryName} help' or README for arguments.`);
    }
    // Connection
    const blockchainBaseUrl = args[0];
    console.info(`Connecting to blockchain ${blockchainBaseUrl} ...`);
    let chainId;
    let stargate = true;
    try {
        chainId = await (await stargate_1.StargateClient.connect(blockchainBaseUrl)).getChainId();
    }
    catch (_error) {
        chainId = await new launchpad_1.CosmosClient(blockchainBaseUrl).getChainId();
        stargate = false;
    }
    console.info(`Connected to network: ${chainId}`);
    // Faucet
    if (!constants.mnemonic)
        throw new Error("The FAUCET_MNEMONIC environment variable is not set");
    const logging = true;
    const faucet = await faucet_1.Faucet.make(blockchainBaseUrl, constants.addressPrefix, constants.tokenConfig, constants.mnemonic, constants.concurrency, stargate, logging);
    const chainTokens = faucet.configuredTokens();
    console.info("Chain tokens:", chainTokens);
    const accounts = await faucet.loadAccounts();
    debugging_1.logAccountsState(accounts);
    let availableTokens = await faucet.availableTokens();
    console.info("Available tokens:", availableTokens);
    setInterval(async () => {
        availableTokens = await faucet.availableTokens();
        console.info("Available tokens:", availableTokens);
    }, 60000);
    await faucet.refill();
    setInterval(async () => faucet.refill(), 60000); // ever 60 seconds
    console.info("Creating webserver ...");
    const server = new webserver_1.Webserver(faucet, { nodeUrl: blockchainBaseUrl, chainId: chainId });
    server.start(constants.port);
    console.info(`Try "curl -sS http://localhost:${constants.port}/status | jq" to check the status.`);
}
exports.start = start;
//# sourceMappingURL=start.js.map