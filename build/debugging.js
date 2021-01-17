"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSendJob = exports.logAccountsState = exports.debugAccount = exports.debugBalance = void 0;
/** A string representation of a coin in a human-readable format that can change at any time */
function debugCoin(coin) {
    return `${coin.amount} ${coin.denom}`;
}
/** A string representation of a balance in a human-readable format that can change at any time */
function debugBalance(data) {
    return `[${data.map((b) => debugCoin(b)).join(", ")}]`;
}
exports.debugBalance = debugBalance;
/** A string representation of an account in a human-readable format that can change at any time */
function debugAccount(account) {
    return `${account.address}: ${debugBalance(account.balance)}`;
}
exports.debugAccount = debugAccount;
function logAccountsState(accounts) {
    if (accounts.length < 2) {
        throw new Error("List of accounts must contain at least one token holder and one distributor");
    }
    const holder = accounts[0];
    const distributors = accounts.slice(1);
    console.info("Holder:\n" + `  ${debugAccount(holder)}`);
    console.info("Distributors:\n" + distributors.map((r) => `  ${debugAccount(r)}`).join("\n"));
}
exports.logAccountsState = logAccountsState;
function logSendJob(job) {
    const from = job.sender;
    const to = job.recipient;
    const amount = debugCoin(job.amount);
    console.info(`Sending ${amount} from ${from} to ${to} ...`);
}
exports.logSendJob = logSendJob;
//# sourceMappingURL=debugging.js.map