"use strict";
exports.__esModule = true;
exports.list = exports.byContractAddress = void 0;
var erc20_signatures_1 = require("@ledgerhq/cryptoassets/data/erc20-signatures");
/**
 * Retrieve the token information by a given contract address if any
 */
var byContractAddress = function (contract) {
    return get().byContract(asContractAddress(contract));
};
exports.byContractAddress = byContractAddress;
/**
 * list all the ERC20 tokens informations
 */
var list = function () { return get().list(); };
exports.list = list;
var asContractAddress = function (addr) {
    var a = addr.toLowerCase();
    return a.startsWith("0x") ? a : "0x" + a;
};
// this internal get() will lazy load and cache the data from the erc20 data blob
var get = (function () {
    var cache;
    return function () {
        if (cache)
            return cache;
        var buf = Buffer.from(erc20_signatures_1["default"], "base64");
        var byContract = {};
        var entries = [];
        var i = 0;
        while (i < buf.length) {
            var length_1 = buf.readUInt32BE(i);
            i += 4;
            var item = buf.slice(i, i + length_1);
            var j = 0;
            var tickerLength = item.readUInt8(j);
            j += 1;
            var ticker = item.slice(j, j + tickerLength).toString("ascii");
            j += tickerLength;
            var contractAddress = asContractAddress(item.slice(j, j + 20).toString("hex"));
            j += 20;
            var decimals = item.readUInt32BE(j);
            j += 4;
            var chainId = item.readUInt32BE(j);
            j += 4;
            var signature = item.slice(j);
            var entry = {
                ticker: ticker,
                contractAddress: contractAddress,
                decimals: decimals,
                chainId: chainId,
                signature: signature,
                data: item
            };
            entries.push(entry);
            byContract[contractAddress] = entry;
            i += length_1;
        }
        var api = {
            list: function () { return entries; },
            byContract: function (contractAddress) { return byContract[contractAddress]; }
        };
        cache = api;
        return api;
    };
})();
