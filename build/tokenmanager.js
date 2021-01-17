"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const math_1 = require("@cosmjs/math");
const defaultCreditAmount = 10000000;
/** Send `factor` times credit amount on refilling */
const defaultRefillFactor = 20;
/** refill when balance gets below `factor` times credit amount */
const defaultRefillThresholdFactor = 8;
class TokenManager {
    constructor(config) {
        this.config = config;
    }
    /** The amount of tokens that will be sent to the user */
    creditAmount(denom, factor = new math_1.Uint53(1)) {
        const amountFromEnv = process.env[`FAUCET_CREDIT_AMOUNT_${denom.toUpperCase()}`];
        const amount = amountFromEnv ? math_1.Uint53.fromString(amountFromEnv).toNumber() : defaultCreditAmount;
        const value = new math_1.Uint53(amount * factor.toNumber());
        return {
            amount: value.toString(),
            denom: denom,
        };
    }
    refillAmount(denom) {
        const factorFromEnv = Number.parseInt(process.env.FAUCET_REFILL_FACTOR || "0", 10) || undefined;
        const factor = new math_1.Uint53(factorFromEnv || defaultRefillFactor);
        return this.creditAmount(denom, factor);
    }
    refillThreshold(denom) {
        const factorFromEnv = Number.parseInt(process.env.FAUCET_REFILL_THRESHOLD || "0", 10) || undefined;
        const factor = new math_1.Uint53(factorFromEnv || defaultRefillThresholdFactor);
        return this.creditAmount(denom, factor);
    }
    /** true iff the distributor account needs a refill */
    needsRefill(account, denom) {
        const balanceAmount = account.balance.find((b) => b.denom === denom);
        const balance = math_1.Decimal.fromAtomics(balanceAmount ? balanceAmount.amount : "0", 0);
        const thresholdAmount = this.refillThreshold(denom);
        const threshold = math_1.Decimal.fromAtomics(thresholdAmount.amount, 0);
        return balance.isLessThan(threshold);
    }
}
exports.TokenManager = TokenManager;
//# sourceMappingURL=tokenmanager.js.map