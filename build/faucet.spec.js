"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const launchpad_1 = require("@cosmjs/launchpad");
const stargate_1 = require("@cosmjs/stargate");
const utils_1 = require("@cosmjs/utils");
const faucet_1 = require("./faucet");
function pendingWithoutLaunchpad() {
    if (!process.env.LAUNCHPAD_ENABLED) {
        return pending("Set LAUNCHPAD_ENABLED to enable Launchpad node-based tests");
    }
}
function pendingWithoutSimapp() {
    if (!process.env.SIMAPP_ENABLED) {
        return pending("Set SIMAPP_ENABLED to enabled Stargate node-based tests");
    }
}
const defaultTokenConfig = {
    bankTokens: ["ucosm", "ustake"],
};
const defaultAddressPrefix = "cosmos";
function makeRandomAddress() {
    return encoding_1.Bech32.encode(defaultAddressPrefix, crypto_1.Random.getBytes(20));
}
const faucetMnemonic = "economy stock theory fatal elder harbor betray wasp final emotion task crumble siren bottom lizard educate guess current outdoor pair theory focus wife stone";
describe("Faucet", () => {
    describe("launchpad", () => {
        const apiUrl = "http://localhost:1317";
        const stargate = false;
        describe("constructor", () => {
            it("can be constructed", async () => {
                pendingWithoutLaunchpad();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                expect(faucet).toBeTruthy();
            });
        });
        describe("availableTokens", () => {
            it("is empty when no tokens are configured", async () => {
                pendingWithoutLaunchpad();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, { bankTokens: [] }, faucetMnemonic, 3, stargate);
                const tickers = await faucet.availableTokens();
                expect(tickers).toEqual([]);
            });
            it("is not empty with default token config", async () => {
                pendingWithoutLaunchpad();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const tickers = await faucet.availableTokens();
                expect(tickers).toEqual(["ucosm", "ustake"]);
            });
        });
        describe("send", () => {
            it("can send bank token", async () => {
                pendingWithoutLaunchpad();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const recipient = makeRandomAddress();
                await faucet.send({
                    amount: {
                        amount: "23456",
                        denom: "ucosm",
                    },
                    sender: faucet.holderAddress,
                    recipient: recipient,
                });
                const readOnlyClient = new launchpad_1.CosmosClient(apiUrl);
                const account = await readOnlyClient.getAccount(recipient);
                utils_1.assert(account);
                expect(account.balance).toEqual([
                    {
                        amount: "23456",
                        denom: "ucosm",
                    },
                ]);
            });
        });
        describe("refill", () => {
            it("works", async () => {
                var _a;
                pendingWithoutLaunchpad();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                await faucet.refill();
                const readOnlyClient = new launchpad_1.CosmosClient(apiUrl);
                const distributorBalance = (_a = (await readOnlyClient.getAccount(faucet.distributorAddresses[0]))) === null || _a === void 0 ? void 0 : _a.balance;
                utils_1.assert(distributorBalance);
                expect(distributorBalance).toEqual([
                    jasmine.objectContaining({
                        denom: "ucosm",
                    }),
                    jasmine.objectContaining({
                        denom: "ustake",
                    }),
                ]);
                expect(Number.parseInt(distributorBalance[0].amount, 10)).toBeGreaterThanOrEqual(80000000);
                expect(Number.parseInt(distributorBalance[1].amount, 10)).toBeGreaterThanOrEqual(80000000);
            });
        });
        describe("credit", () => {
            it("works for fee token", async () => {
                pendingWithoutLaunchpad();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const recipient = makeRandomAddress();
                await faucet.credit(recipient, "ucosm");
                const readOnlyClient = new launchpad_1.CosmosClient(apiUrl);
                const account = await readOnlyClient.getAccount(recipient);
                utils_1.assert(account);
                expect(account.balance).toEqual([
                    {
                        amount: "10000000",
                        denom: "ucosm",
                    },
                ]);
            });
            it("works for stake token", async () => {
                pendingWithoutLaunchpad();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const recipient = makeRandomAddress();
                await faucet.credit(recipient, "ustake");
                const readOnlyClient = new launchpad_1.CosmosClient(apiUrl);
                const account = await readOnlyClient.getAccount(recipient);
                utils_1.assert(account);
                expect(account.balance).toEqual([
                    {
                        amount: "10000000",
                        denom: "ustake",
                    },
                ]);
            });
        });
        describe("configuredTokens", () => {
            it("works", async () => {
                pendingWithoutLaunchpad();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const tickers = faucet.configuredTokens();
                expect(tickers).toEqual(["ucosm", "ustake"]);
            });
        });
        describe("loadAccounts", () => {
            it("works", async () => {
                pendingWithoutLaunchpad();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 1, stargate);
                const accounts = await faucet.loadAccounts();
                const readOnlyClient = new launchpad_1.CosmosClient(apiUrl);
                const expectedHolderAccount = await readOnlyClient.getAccount(faucet.holderAddress);
                const expectedDistributorAccount = await readOnlyClient.getAccount(faucet.distributorAddresses[0]);
                utils_1.assert(expectedHolderAccount);
                utils_1.assert(expectedDistributorAccount);
                expect(accounts).toEqual([
                    jasmine.objectContaining({
                        address: expectedHolderAccount.address,
                        balance: expectedHolderAccount.balance,
                    }),
                    jasmine.objectContaining({
                        address: expectedDistributorAccount.address,
                        balance: expectedDistributorAccount.balance,
                    }),
                ]);
            });
        });
    });
    describe("stargate", () => {
        const apiUrl = "localhost:26658";
        const stargate = true;
        let originalEnvVariable;
        beforeAll(() => {
            originalEnvVariable = process.env.FAUCET_CREDIT_AMOUNT_USTAKE;
            process.env.FAUCET_CREDIT_AMOUNT_USTAKE = "100000";
        });
        afterAll(() => {
            process.env.FAUCET_CREDIT_AMOUNT_USTAKE = originalEnvVariable;
        });
        describe("constructor", () => {
            it("can be constructed", async () => {
                pendingWithoutSimapp();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                expect(faucet).toBeTruthy();
            });
        });
        describe("availableTokens", () => {
            it("is empty when no tokens are configured", async () => {
                pendingWithoutSimapp();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, { bankTokens: [] }, faucetMnemonic, 3, stargate);
                const tickers = await faucet.availableTokens();
                expect(tickers).toEqual([]);
            });
            it("is not empty with default token config", async () => {
                pendingWithoutSimapp();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const tickers = await faucet.availableTokens();
                expect(tickers).toEqual(["ucosm", "ustake"]);
            });
        });
        describe("send", () => {
            it("can send bank token", async () => {
                pendingWithoutSimapp();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const recipient = makeRandomAddress();
                await faucet.send({
                    amount: {
                        amount: "23456",
                        denom: "ucosm",
                    },
                    sender: faucet.holderAddress,
                    recipient: recipient,
                });
                const readOnlyClient = await stargate_1.StargateClient.connect(apiUrl);
                const account = await readOnlyClient.getAllBalancesUnverified(recipient);
                utils_1.assert(account);
                expect(account).toEqual([
                    {
                        amount: "23456",
                        denom: "ucosm",
                    },
                ]);
            });
        });
        describe("refill", () => {
            it("works", async () => {
                pendingWithoutSimapp();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                await faucet.refill();
                const readOnlyClient = await stargate_1.StargateClient.connect(apiUrl);
                const distributorBalance = await readOnlyClient.getAllBalancesUnverified(faucet.distributorAddresses[0]);
                utils_1.assert(distributorBalance);
                expect(distributorBalance).toEqual([
                    jasmine.objectContaining({
                        denom: "ucosm",
                    }),
                    jasmine.objectContaining({
                        denom: "ustake",
                    }),
                ]);
                expect(Number.parseInt(distributorBalance[0].amount, 10)).toBeGreaterThanOrEqual(80000000);
                expect(Number.parseInt(distributorBalance[1].amount, 10)).toBeGreaterThanOrEqual(800000);
            });
        });
        describe("credit", () => {
            it("works for fee token", async () => {
                pendingWithoutSimapp();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const recipient = makeRandomAddress();
                await faucet.credit(recipient, "ucosm");
                const readOnlyClient = await stargate_1.StargateClient.connect(apiUrl);
                const balance = await readOnlyClient.getAllBalancesUnverified(recipient);
                utils_1.assert(balance);
                expect(balance).toEqual([
                    {
                        amount: "10000000",
                        denom: "ucosm",
                    },
                ]);
            });
            it("works for stake token", async () => {
                pendingWithoutSimapp();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const recipient = makeRandomAddress();
                await faucet.credit(recipient, "ustake");
                const readOnlyClient = await stargate_1.StargateClient.connect(apiUrl);
                const balance = await readOnlyClient.getAllBalancesUnverified(recipient);
                utils_1.assert(balance);
                expect(balance).toEqual([
                    {
                        amount: "100000",
                        denom: "ustake",
                    },
                ]);
            });
        });
        describe("configuredTokens", () => {
            it("works", async () => {
                pendingWithoutSimapp();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 3, stargate);
                const tickers = faucet.configuredTokens();
                expect(tickers).toEqual(["ucosm", "ustake"]);
            });
        });
        describe("loadAccounts", () => {
            it("works", async () => {
                pendingWithoutSimapp();
                const faucet = await faucet_1.Faucet.make(apiUrl, defaultAddressPrefix, defaultTokenConfig, faucetMnemonic, 1, stargate);
                const accounts = await faucet.loadAccounts();
                const readOnlyClient = await stargate_1.StargateClient.connect(apiUrl);
                const expectedHolderBalance = await readOnlyClient.getAllBalancesUnverified(faucet.holderAddress);
                const expectedDistributorBalance = await readOnlyClient.getAllBalancesUnverified(faucet.distributorAddresses[0]);
                utils_1.assert(expectedHolderBalance);
                utils_1.assert(expectedDistributorBalance);
                expect(accounts).toEqual([
                    jasmine.objectContaining({
                        address: faucet.holderAddress,
                        balance: expectedHolderBalance,
                    }),
                    jasmine.objectContaining({
                        address: faucet.distributorAddresses[0],
                        balance: expectedDistributorBalance,
                    }),
                ]);
            });
        });
    });
});
//# sourceMappingURL=faucet.spec.js.map