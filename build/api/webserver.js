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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webserver = void 0;
const koa_1 = __importDefault(require("koa"));
const cors = require("@koa/cors");
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const addresses_1 = require("../addresses");
const constants = __importStar(require("../constants"));
const httperror_1 = require("./httperror");
const requestparser_1 = require("./requestparser");
class Webserver {
    constructor(faucet, chainConstants) {
        this.api = new koa_1.default();
        this.api.use(cors());
        this.api.use(koa_bodyparser_1.default());
        this.api.use(async (context) => {
            switch (context.path) {
                case "/":
                case "/healthz":
                    context.response.body =
                        "Welcome to the faucet!\n" +
                            "\n" +
                            "Check the full status via the /status endpoint.\n" +
                            "You can get tokens from here by POSTing to /credit.\n" +
                            "See https://github.com/CosmWasm/cosmjs/tree/master/packages/faucet for all further information.\n";
                    break;
                case "/status": {
                    const [holder, ...distributors] = await faucet.loadAccounts();
                    const availableTokens = await faucet.availableTokens();
                    const chainTokens = faucet.configuredTokens();
                    context.response.body = Object.assign(Object.assign({ status: "ok" }, chainConstants), { chainTokens: chainTokens, availableTokens: availableTokens, holder: holder, distributors: distributors });
                    break;
                }
                case "/credit": {
                    if (context.request.method !== "POST") {
                        throw new httperror_1.HttpError(405, "This endpoint requires a POST request");
                    }
                    if (context.request.type !== "application/json") {
                        throw new httperror_1.HttpError(415, "Content-type application/json expected");
                    }
                    // context.request.body is set by the bodyParser() plugin
                    const requestBody = context.request.body;
                    const creditBody = requestparser_1.RequestParser.parseCreditBody(requestBody);
                    const { address, denom } = creditBody;
                    if (!addresses_1.isValidAddress(address, constants.addressPrefix)) {
                        throw new httperror_1.HttpError(400, "Address is not in the expected format for this chain.");
                    }
                    const availableTokens = await faucet.availableTokens();
                    const matchingDenom = availableTokens.find((availableDenom) => availableDenom === denom);
                    if (matchingDenom === undefined) {
                        throw new httperror_1.HttpError(422, `Token is not available. Available tokens are: ${availableTokens}`);
                    }
                    try {
                        await faucet.credit(address, matchingDenom);
                    }
                    catch (e) {
                        console.error(e);
                        throw new httperror_1.HttpError(500, "Sending tokens failed");
                    }
                    context.response.body = "ok";
                    break;
                }
                default:
                // koa sends 404 by default
            }
        });
    }
    start(port) {
        console.info(`Starting webserver on port ${port} ...`);
        this.api.listen(port);
    }
}
exports.Webserver = Webserver;
//# sourceMappingURL=webserver.js.map