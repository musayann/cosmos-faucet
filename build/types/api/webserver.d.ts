import { Faucet } from "../faucet";
/** This will be passed 1:1 to the user */
export interface ChainConstants {
    readonly nodeUrl: string;
    readonly chainId: string;
}
export declare class Webserver {
    private readonly api;
    constructor(faucet: Faucet, chainConstants: ChainConstants);
    start(port: number): void;
}
