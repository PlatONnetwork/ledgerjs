var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { listFiatCurrencies, getFiatCurrencyByTicker, hasFiatCurrencyTicker, } from "./fiats";
import { listTokens, findTokenById } from "./tokens";
import { listCryptoCurrencies, hasCryptoCurrencyId, getCryptoCurrencyById, findCryptoCurrency, findCryptoCurrencyById, findCryptoCurrencyByScheme, findCryptoCurrencyByTicker, findCryptoCurrencyByKeyword, registerCryptoCurrency, } from "./currencies";
test("can get currency by coin type", function () {
    expect(getCryptoCurrencyById("bitcoin")).toMatchObject({
        id: "bitcoin",
        name: "Bitcoin"
    });
    expect(getCryptoCurrencyById("litecoin")).toMatchObject({
        id: "litecoin",
        name: "Litecoin"
    });
    expect(hasCryptoCurrencyId("bitcoin")).toBe(true);
    expect(hasCryptoCurrencyId("")).toBe(false);
    expect(function () { return getCryptoCurrencyById(""); }).toThrow();
    expect(hasCryptoCurrencyId("_")).toBe(false);
    expect(function () { return getCryptoCurrencyById("_"); }).toThrow();
});
test("can find currency", function () {
    var bitcoinMatch = {
        id: "bitcoin",
        name: "Bitcoin"
    };
    expect(findCryptoCurrency(function (c) { return c.name === "Bitcoin"; })).toMatchObject(bitcoinMatch);
    expect(findCryptoCurrencyById("bitcoin")).toMatchObject(bitcoinMatch);
    expect(findCryptoCurrencyByKeyword("btc")).toMatchObject(bitcoinMatch);
    expect(findCryptoCurrencyByKeyword("btc")).toMatchObject(bitcoinMatch);
    expect(findCryptoCurrencyByKeyword("btc")).toMatchObject(bitcoinMatch);
    expect(findCryptoCurrencyByTicker("BTC")).toMatchObject(bitcoinMatch);
    expect(findCryptoCurrencyByScheme("bitcoin")).toMatchObject(bitcoinMatch);
    expect(findCryptoCurrencyById("_")).toBe(undefined);
    expect(findCryptoCurrencyByKeyword("_")).toBe(undefined);
    expect(findCryptoCurrencyByKeyword("_")).toBe(undefined);
    expect(findCryptoCurrencyByKeyword("_")).toBe(undefined);
    expect(findCryptoCurrencyByTicker("_")).toBe(undefined);
    expect(findCryptoCurrencyByScheme("_")).toBe(undefined);
});
test("there are some dev cryptocurrencies", function () {
    var all = listCryptoCurrencies(true);
    var prod = listCryptoCurrencies();
    expect(all).not.toBe(prod);
    expect(all.filter(function (a) { return !a.isTestnetFor; })).toMatchObject(prod);
    expect(all.length).toBeGreaterThan(prod.length);
});
test("there are some terminated cryptocurrencies", function () {
    var all = listCryptoCurrencies(false, true);
    var supported = listCryptoCurrencies();
    expect(all).not.toBe(supported);
    expect(all.filter(function (a) { return !a.terminated; })).toMatchObject(supported);
    expect(all.length).toBeGreaterThan(supported.length);
});
test("all cryptocurrencies match (by reference) the one you get by id", function () {
    var e_1, _a;
    try {
        for (var _b = __values(listCryptoCurrencies()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var c = _c.value;
            expect(c).toBe(getCryptoCurrencyById(c.id));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
test("there is no testnet or terminated coin by default", function () {
    var e_2, _a;
    expect(listCryptoCurrencies(false, false)).toBe(listCryptoCurrencies());
    expect(listCryptoCurrencies(true, true).length).toBeGreaterThan(listCryptoCurrencies().length);
    try {
        for (var _b = __values(listCryptoCurrencies()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var c = _c.value;
            expect(!c.terminated).toBe(true);
            expect(!c.isTestnetFor).toBe(true);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
});
test("all cryptocurrencies have at least one unit", function () {
    var e_3, _a;
    try {
        for (var _b = __values(listCryptoCurrencies()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var c = _c.value;
            expect(c.units.length).toBeGreaterThan(0);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
});
test("fiats list is always the same", function () {
    expect(listFiatCurrencies()).toEqual(listFiatCurrencies());
});
test("fiats list elements are correct", function () {
    var e_4, _a;
    var tickers = {};
    try {
        for (var _b = __values(listFiatCurrencies()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var fiat = _c.value;
            expect(fiat.ticker).toBeTruthy();
            expect(typeof fiat.ticker).toBe("string");
            expect(tickers[fiat.ticker]).toBeFalsy();
            expect(fiat.units.length).toBeGreaterThan(0);
            var unit = fiat.units[0];
            expect(unit.code).toBeTruthy();
            expect(typeof unit.code).toBe("string");
            expect(unit.name).toBeTruthy();
            expect(typeof unit.name).toBe("string");
            expect(unit.magnitude).toBeGreaterThan(-1);
            expect(typeof unit.magnitude).toBe("number");
            tickers[fiat.ticker] = unit;
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_4) throw e_4.error; }
    }
});
test("tokens are correct", function () {
    var e_5, _a;
    expect(listTokens().length).toBeGreaterThan(0);
    try {
        for (var _b = __values(listTokens()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var token = _c.value;
            expect(token.ticker).toBeTruthy();
            expect(typeof token.id).toBe("string");
            expect(typeof token.name).toBe("string");
            if (token.ledgerSignature) {
                expect(typeof token.ledgerSignature).toBe("string");
            }
            expect(typeof token.tokenType).toBe("string");
            expect(typeof token.parentCurrency).toBe("object");
            expect(hasCryptoCurrencyId(token.parentCurrency.id)).toBe(true);
            expect(typeof token.ticker).toBe("string");
            expect(token.units.length).toBeGreaterThan(0);
            var unit = token.units[0];
            expect(unit.code).toBeTruthy();
            expect(typeof unit.code).toBe("string");
            expect(unit.name).toBeTruthy();
            expect(typeof unit.name).toBe("string");
            expect(unit.magnitude).toBeGreaterThan(-1);
            expect(typeof unit.magnitude).toBe("number");
            if (token.compoundFor) {
                var t = findTokenById(token.compoundFor);
                expect(typeof t).toBe("object");
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_5) throw e_5.error; }
    }
});
test("fiats list is sorted by ticker", function () {
    expect(listFiatCurrencies()
        .map(function (fiat) { return fiat.ticker; })
        .join(",")).toEqual(listFiatCurrencies()
        .map(function (fiat) { return fiat.ticker; })
        .sort(function (a, b) { return (a > b ? 1 : -1); })
        .join(","));
});
test("can get fiat by coin type", function () {
    expect(getFiatCurrencyByTicker("USD").units[0]).toMatchObject({
        magnitude: 2
    });
    expect(getFiatCurrencyByTicker("EUR").units[0]).toMatchObject({
        magnitude: 2
    });
    // this is not a fiat \o/
    expect(function () { return getFiatCurrencyByTicker("USDT").units[0]; }).toThrow();
    expect(hasFiatCurrencyTicker("USD")).toBe(true);
    expect(hasFiatCurrencyTicker("USDT")).toBe(false);
});
test("all USDT are countervalue enabled", function () {
    var tokens = listTokens().filter(function (t) { return t.ticker === "USDT" && !t.parentCurrency.isTestnetFor; });
    expect(tokens.map(function (t) { return t.id; }).sort()).toMatchSnapshot();
    expect(tokens.every(function (t) { return t.disableCountervalue === false; })).toBe(true);
});
test("can register a new coin externally", function () {
    var coinId = "mycoin";
    expect(function () { return getCryptoCurrencyById("mycoin"); }).toThrow("currency with id \"" + coinId + "\" not found");
    var mycoin = {
        type: "CryptoCurrency",
        id: coinId,
        coinType: 8008,
        name: "MyCoin",
        managerAppName: "MyCoin",
        ticker: "MYC",
        countervalueTicker: "MYC",
        scheme: "mycoin",
        color: "#ff0000",
        family: "mycoin",
        units: [
            {
                name: "MYC",
                code: "MYC",
                magnitude: 8
            },
            {
                name: "SmallestUnit",
                code: "SMALLESTUNIT",
                magnitude: 0
            },
        ],
        explorerViews: [
            {
                address: "https://mycoinexplorer.com/account/$address",
                tx: "https://mycoinexplorer.com/transaction/$hash",
                token: "https://mycoinexplorer.com/token/$contractAddress/?a=$address"
            },
        ]
    };
    registerCryptoCurrency(coinId, mycoin);
    expect(getCryptoCurrencyById(coinId)).toEqual(mycoin);
});
//# sourceMappingURL=currencies.test.js.map