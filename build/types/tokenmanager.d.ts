import { Coin } from "@cosmjs/launchpad";
import { Uint53 } from "@cosmjs/math";
import { MinimalAccount } from "./types";
export interface TokenConfiguration {
    /** Supported tokens of the Cosmos SDK bank module */
    readonly bankTokens: readonly string[];
}
export declare class TokenManager {
    private readonly config;
    constructor(config: TokenConfiguration);
    /** The amount of tokens that will be sent to the user */
    creditAmount(denom: string, factor?: Uint53): Coin;
    refillAmount(denom: string): Coin;
    refillThreshold(denom: string): Coin;
    /** true iff the distributor account needs a refill */
    needsRefill(account: MinimalAccount, denom: string): boolean;
}
