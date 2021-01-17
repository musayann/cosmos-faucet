import { TokenConfiguration } from "./tokenmanager";
import { MinimalAccount, SendJob } from "./types";
export declare class Faucet {
    static make(apiUrl: string, addressPrefix: string, config: TokenConfiguration, mnemonic: string, numberOfDistributors: number, stargate?: boolean, logging?: boolean): Promise<Faucet>;
    readonly addressPrefix: string;
    readonly holderAddress: string;
    readonly distributorAddresses: readonly string[];
    private readonly tokenConfig;
    private readonly tokenManager;
    private readonly readOnlyClient;
    private readonly clients;
    private readonly logging;
    private creditCount;
    private constructor();
    /**
     * Returns a list of denoms of tokens owned by the the holder and configured in the faucet
     */
    availableTokens(): Promise<string[]>;
    /**
     * Creates and broadcasts a send transaction. Then waits until the transaction is in a block.
     * Throws an error if the transaction failed.
     */
    send(job: SendJob): Promise<void>;
    /** Use one of the distributor accounts to send tokens to user */
    credit(recipient: string, denom: string): Promise<void>;
    /** Returns a list to token denoms which are configured */
    configuredTokens(): string[];
    loadAccount(address: string): Promise<MinimalAccount>;
    loadAccounts(): Promise<readonly MinimalAccount[]>;
    refill(): Promise<void>;
    /** returns an integer >= 0 that increments and is unique for this instance */
    private getCreditCount;
}
