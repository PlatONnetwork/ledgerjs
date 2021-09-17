/// <reference types="node" />
/**
 * Retrieve the token information by a given contract address if any
 */
export declare const byContractAddress: (contract: string) => TokenInfo | null | undefined;
/**
 * list all the PRC20 tokens informations
 */
export declare const list: () => TokenInfo[];
export declare type TokenInfo = {
    contractAddress: string;
    ticker: string;
    decimals: number;
    chainId: number;
    signature: Buffer;
    data: Buffer;
};
export declare type API = {
    byContract: (arg0: string) => TokenInfo | null | undefined;
    list: () => TokenInfo[];
};
//# sourceMappingURL=prc20.d.ts.map