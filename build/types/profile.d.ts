import { SigningCosmosClient } from "@cosmjs/launchpad";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
export declare function createWallets(mnemonic: string, addressPrefix: string, numberOfDistributors: number, stargate?: boolean, logging?: boolean): Promise<ReadonlyArray<readonly [string, OfflineSigner]>>;
export declare function createClients(apiUrl: string, wallets: ReadonlyArray<readonly [string, OfflineSigner]>): Promise<ReadonlyArray<readonly [string, SigningCosmosClient | SigningStargateClient]>>;
