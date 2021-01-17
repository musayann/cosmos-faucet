export declare class HttpError extends Error {
    readonly status: number;
    readonly expose: boolean;
    constructor(status: number, text: string, expose?: boolean);
}
