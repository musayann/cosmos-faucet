import { Coin } from "@cosmjs/launchpad";
import { MinimalAccount, SendJob } from "./types";
/** A string representation of a balance in a human-readable format that can change at any time */
export declare function debugBalance(data: readonly Coin[]): string;
/** A string representation of an account in a human-readable format that can change at any time */
export declare function debugAccount(account: MinimalAccount): string;
export declare function logAccountsState(accounts: readonly MinimalAccount[]): void;
export declare function logSendJob(job: SendJob): void;
