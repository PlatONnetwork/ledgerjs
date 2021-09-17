import type { TokenCurrency, CryptoCurrency } from "./types";
declare type TokensListOptions = {
    withDelisted: boolean;
};
/**
 *
 */
export declare function listTokens(options?: Partial<TokensListOptions>): TokenCurrency[];
/**
 *
 */
export declare function listTokensForCryptoCurrency(currency: CryptoCurrency, options?: Partial<TokensListOptions>): TokenCurrency[];
/**
 *
 */
export declare function listTokenTypesForCryptoCurrency(currency: CryptoCurrency): string[];
/**
 *
 */
export declare function findTokenByTicker(ticker: string): TokenCurrency | null | undefined;
/**
 *
 */
export declare function findTokenById(id: string): TokenCurrency | null | undefined;
/**
 *
 */
export declare function findTokenByAddress(address: string): TokenCurrency | null | undefined;
/**
 *
 */
export declare const hasTokenId: (id: string) => boolean;
/**
 *
 */
export declare function getTokenById(id: string): TokenCurrency;
/**
 * if a given token account is a token that can be used in compound, give the associated compound token (cToken)
 * @param {*} token
 */
export declare function findCompoundToken(token: TokenCurrency): TokenCurrency | null | undefined;
export {};
//# sourceMappingURL=tokens.d.ts.map