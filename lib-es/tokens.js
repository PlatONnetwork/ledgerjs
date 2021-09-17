var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { getCryptoCurrencyById } from "./currencies";
import erc20tokens from "../data/erc20";
import trc10tokens from "../data/trc10";
import trc20tokens from "../data/trc20";
import bep20tokens from "../data/bep20";
import asatokens from "../data/asa";
var emptyArray = [];
var tokensArray = [];
var tokensArrayWithDelisted = [];
var tokensByCryptoCurrency = {};
var tokensByCryptoCurrencyWithDelisted = {};
var tokensById = {};
var tokensByTicker = {};
var tokensByAddress = {};
addTokens(erc20tokens.map(convertERC20));
addTokens(trc10tokens.map(convertTRONTokens("trc10")));
addTokens(trc20tokens.map(convertTRONTokens("trc20")));
addTokens(bep20tokens.map(convertBEP20));
addTokens(asatokens.map(convertAlgorandASATokens));
var defaultTokenListOptions = {
    withDelisted: false
};
/**
 *
 */
export function listTokens(options) {
    var withDelisted = __assign(__assign({}, defaultTokenListOptions), options).withDelisted;
    return withDelisted ? tokensArrayWithDelisted : tokensArray;
}
/**
 *
 */
export function listTokensForCryptoCurrency(currency, options) {
    var withDelisted = __assign(__assign({}, defaultTokenListOptions), options).withDelisted;
    if (withDelisted) {
        return tokensByCryptoCurrencyWithDelisted[currency.id] || emptyArray;
    }
    return tokensByCryptoCurrency[currency.id] || emptyArray;
}
/**
 *
 */
export function listTokenTypesForCryptoCurrency(currency) {
    return listTokensForCryptoCurrency(currency).reduce(function (acc, cur) {
        var tokenType = cur.tokenType;
        if (acc.indexOf(tokenType) < 0) {
            return __spreadArray(__spreadArray([], __read(acc)), [tokenType]);
        }
        return acc;
    }, []);
}
/**
 *
 */
export function findTokenByTicker(ticker) {
    return tokensByTicker[ticker];
}
/**
 *
 */
export function findTokenById(id) {
    return tokensById[id];
}
/**
 *
 */
export function findTokenByAddress(address) {
    return tokensByAddress[address.toLowerCase()];
}
/**
 *
 */
export var hasTokenId = function (id) { return id in tokensById; };
/**
 *
 */
export function getTokenById(id) {
    var currency = findTokenById(id);
    if (!currency) {
        throw new Error("token with id \"" + id + "\" not found");
    }
    return currency;
}
/**
 * if a given token account is a token that can be used in compound, give the associated compound token (cToken)
 * @param {*} token
 */
export function findCompoundToken(token) {
    // TODO can be optimized by generating a direct map
    return listTokensForCryptoCurrency(token.parentCurrency, {
        withDelisted: true
    }).find(function (t) { return t.compoundFor === token.id; });
}
function comparePriority(a, b) {
    return Number(!!b.disableCountervalue) - Number(!!a.disableCountervalue);
}
function addTokens(list) {
    list.forEach(function (token) {
        if (!token.delisted)
            tokensArray.push(token);
        tokensArrayWithDelisted.push(token);
        tokensById[token.id] = token;
        if (!tokensByTicker[token.ticker] ||
            comparePriority(token, tokensByTicker[token.ticker]) > 0) {
            tokensByTicker[token.ticker] = token;
        }
        tokensByAddress[token.contractAddress.toLowerCase()] = token;
        var parentCurrency = token.parentCurrency;
        if (!(parentCurrency.id in tokensByCryptoCurrency)) {
            tokensByCryptoCurrency[parentCurrency.id] = [];
        }
        if (!(parentCurrency.id in tokensByCryptoCurrencyWithDelisted)) {
            tokensByCryptoCurrencyWithDelisted[parentCurrency.id] = [];
        }
        if (!token.delisted)
            tokensByCryptoCurrency[parentCurrency.id].push(token);
        tokensByCryptoCurrencyWithDelisted[parentCurrency.id].push(token);
    });
}
function convertERC20(_a) {
    var _b = __read(_a, 11), parentCurrencyId = _b[0], token = _b[1], ticker = _b[2], magnitude = _b[3], name = _b[4], ledgerSignature = _b[5], contractAddress = _b[6], disableCountervalue = _b[7], delisted = _b[8], countervalueTicker = _b[9], compoundFor = _b[10];
    var parentCurrency = getCryptoCurrencyById(parentCurrencyId);
    return {
        type: "TokenCurrency",
        id: parentCurrencyId + "/erc20/" + token,
        ledgerSignature: ledgerSignature,
        contractAddress: contractAddress,
        parentCurrency: parentCurrency,
        tokenType: "erc20",
        name: name,
        ticker: ticker,
        delisted: delisted,
        disableCountervalue: !!parentCurrency.isTestnetFor || !!disableCountervalue,
        countervalueTicker: countervalueTicker,
        compoundFor: compoundFor
            ? parentCurrencyId + "/erc20/" + compoundFor
            : undefined,
        units: [
            {
                name: name,
                code: ticker,
                magnitude: magnitude
            },
        ]
    };
}
function convertBEP20(_a) {
    var _b = __read(_a, 10), parentCurrencyId = _b[0], token = _b[1], ticker = _b[2], magnitude = _b[3], name = _b[4], ledgerSignature = _b[5], contractAddress = _b[6], disableCountervalue = _b[7], delisted = _b[8], countervalueTicker = _b[9];
    var parentCurrency = getCryptoCurrencyById(parentCurrencyId);
    return {
        type: "TokenCurrency",
        id: parentCurrencyId + "/bep20/" + token,
        ledgerSignature: ledgerSignature,
        contractAddress: contractAddress,
        parentCurrency: parentCurrency,
        tokenType: "bep20",
        name: name,
        ticker: ticker,
        delisted: delisted,
        disableCountervalue: !!parentCurrency.isTestnetFor || !!disableCountervalue,
        countervalueTicker: countervalueTicker,
        units: [
            {
                name: name,
                code: ticker,
                magnitude: magnitude
            },
        ]
    };
}
function convertAlgorandASATokens(_a) {
    var _b = __read(_a, 6), id = _b[0], abbr = _b[1], name = _b[2], contractAddress = _b[3], precision = _b[4], enableCountervalues = _b[5];
    return {
        type: "TokenCurrency",
        id: "algorand/asa/" + id,
        contractAddress: contractAddress,
        parentCurrency: getCryptoCurrencyById("algorand"),
        tokenType: "asa",
        name: name,
        ticker: abbr,
        disableCountervalue: !enableCountervalues,
        units: [
            {
                name: name,
                code: abbr,
                magnitude: precision
            },
        ]
    };
}
function convertTRONTokens(type) {
    return function (_a) {
        var _b = __read(_a, 8), id = _b[0], abbr = _b[1], name = _b[2], contractAddress = _b[3], precision = _b[4], delisted = _b[5], ledgerSignature = _b[6], enableCountervalues = _b[7];
        return ({
            type: "TokenCurrency",
            id: "tron/" + type + "/" + id,
            contractAddress: contractAddress,
            parentCurrency: getCryptoCurrencyById("tron"),
            tokenType: type,
            name: name,
            ticker: abbr,
            delisted: delisted,
            disableCountervalue: !enableCountervalues,
            ledgerSignature: ledgerSignature,
            units: [
                {
                    name: name,
                    code: abbr,
                    magnitude: precision
                },
            ]
        });
    };
}
//# sourceMappingURL=tokens.js.map