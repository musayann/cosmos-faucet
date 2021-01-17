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
exports.Faucet = void 0;
const launchpad_1 = require("@cosmjs/launchpad");
const stargate_1 = require("@cosmjs/stargate");
const utils_1 = require("@cosmjs/utils");
const constants = __importStar(require("./constants"));
const debugging_1 = require("./debugging");
const profile_1 = require("./profile");
const tokenmanager_1 = require("./tokenmanager");
function isDefined(value) {
    return value !== undefined;
}
class Faucet {
    constructor(addressPrefix, config, clients, readonlyClient, logging = false) {
        this.creditCount = 0;
        this.addressPrefix = addressPrefix;
        this.tokenConfig = config;
        this.tokenManager = new tokenmanager_1.TokenManager(config);
        this.readOnlyClient = readonlyClient;
        [this.holderAddress, ...this.distributorAddresses] = clients.map(([address]) => address);
        this.clients = clients.reduce((acc, [senderAddress, client]) => (Object.assign(Object.assign({}, acc), { [senderAddress]: client })), {});
        this.logging = logging;
    }
    static async make(apiUrl, addressPrefix, config, mnemonic, numberOfDistributors, stargate = true, logging = false) {
        const wallets = await profile_1.createWallets(mnemonic, addressPrefix, numberOfDistributors, stargate, logging);
        const clients = await profile_1.createClients(apiUrl, wallets);
        const readonlyClient = stargate ? await stargate_1.StargateClient.connect(apiUrl) : new launchpad_1.CosmosClient(apiUrl);
        return new Faucet(addressPrefix, config, clients, readonlyClient, logging);
    }
    /**
     * Returns a list of denoms of tokens owned by the the holder and configured in the faucet
     */
    async availableTokens() {
        const { balance } = await this.loadAccount(this.holderAddress);
        return balance
            .filter((b) => b.amount !== "0")
            .map((b) => this.tokenConfig.bankTokens.find((token) => token == b.denom))
            .filter(isDefined);
    }
    /**
     * Creates and broadcasts a send transaction. Then waits until the transaction is in a block.
     * Throws an error if the transaction failed.
     */
    async send(job) {
        const client = this.clients[job.sender];
        if (client instanceof launchpad_1.SigningCosmosClient) {
            const result = await client.sendTokens(job.recipient, [job.amount], constants.memo);
            return launchpad_1.assertIsBroadcastTxSuccess(result);
        }
        const result = await client.sendTokens(job.sender, job.recipient, [job.amount], constants.memo);
        stargate_1.assertIsBroadcastTxSuccess(result);
    }
    /** Use one of the distributor accounts to send tokens to user */
    async credit(recipient, denom) {
        if (this.distributorAddresses.length === 0)
            throw new Error("No distributor account available");
        const sender = this.distributorAddresses[this.getCreditCount() % this.distributorAddresses.length];
        const job = {
            sender: sender,
            recipient: recipient,
            amount: this.tokenManager.creditAmount(denom),
        };
        if (this.logging)
            debugging_1.logSendJob(job);
        await this.send(job);
    }
    /** Returns a list to token denoms which are configured */
    configuredTokens() {
        return Array.from(this.tokenConfig.bankTokens);
    }
    async loadAccount(address) {
        var _a, _b;
        const balance = this.readOnlyClient instanceof launchpad_1.CosmosClient
            ? (_b = (_a = (await this.readOnlyClient.getAccount(address))) === null || _a === void 0 ? void 0 : _a.balance) !== null && _b !== void 0 ? _b : [] : await this.readOnlyClient.getAllBalancesUnverified(address);
        return {
            address: address,
            balance: balance,
        };
    }
    async loadAccounts() {
        const addresses = [this.holderAddress, ...this.distributorAddresses];
        return Promise.all(addresses.map(this.loadAccount.bind(this)));
    }
    async refill() {
        if (this.logging) {
            console.info(`Connected to network: ${await this.readOnlyClient.getChainId()}`);
            console.info(`Tokens on network: ${this.configuredTokens().join(", ")}`);
        }
        const accounts = await this.loadAccounts();
        if (this.logging)
            debugging_1.logAccountsState(accounts);
        const [_, ...distributorAccounts] = accounts;
        const availableTokenDenoms = await this.availableTokens();
        if (this.logging)
            console.info("Available tokens:", availableTokenDenoms);
        const jobs = [];
        for (const denom of availableTokenDenoms) {
            const refillDistibutors = distributorAccounts.filter((account) => this.tokenManager.needsRefill(account, denom));
            if (this.logging) {
                console.info(`Refilling ${denom} of:`);
                console.info(refillDistibutors.length
                    ? refillDistibutors.map((r) => `  ${debugging_1.debugAccount(r)}`).join("\n")
                    : "  none");
            }
            for (const refillDistibutor of refillDistibutors) {
                jobs.push({
                    sender: this.holderAddress,
                    recipient: refillDistibutor.address,
                    amount: this.tokenManager.refillAmount(denom),
                });
            }
        }
        if (jobs.length > 0) {
            for (const job of jobs) {
                if (this.logging)
                    debugging_1.logSendJob(job);
                // don't crash faucet when one send fails
                try {
                    await this.send(job);
                }
                catch (error) {
                    console.error(error);
                }
                await utils_1.sleep(75);
            }
            if (this.logging) {
                console.info("Done refilling accounts.");
                debugging_1.logAccountsState(await this.loadAccounts());
            }
        }
        else {
            if (this.logging) {
                console.info("Nothing to be done. Anyways, thanks for checking.");
            }
        }
    }
    /** returns an integer >= 0 that increments and is unique for this instance */
    getCreditCount() {
        return this.creditCount++;
    }
}
exports.Faucet = Faucet;
//# sourceMappingURL=faucet.js.map