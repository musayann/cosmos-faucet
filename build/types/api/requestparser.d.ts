export interface CreditRequestBodyData {
    /** The base denomination */
    readonly denom: string;
    /** The recipient address */
    readonly address: string;
}
export interface CreditRequestBodyDataWithTicker {
    /** The ticker symbol */
    readonly ticker: string;
    /** The recipient address */
    readonly address: string;
}
export declare class RequestParser {
    static parseCreditBody(body: unknown): CreditRequestBodyData;
}
