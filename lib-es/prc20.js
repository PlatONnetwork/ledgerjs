import blob from "@ledgerhq/cryptoassets/data/prc20-signatures";
/**
 * Retrieve the token information by a given contract address if any
 */
export var byContractAddress = function (contract) {
    return get().byContract(asContractAddress(contract));
};
/**
 * list all the PRC20 tokens informations
 */
export var list = function () { return get().list(); };
var asContractAddress = function (addr) {
    var a = addr.toLowerCase();
    return a.startsWith("0x") ? a : "0x" + a;
};
// this internal get() will lazy load and cache the data from the PRC20 data blob
var get = (function () {
    var cache;
    return function () {
        if (cache)
            return cache;
        var buf = Buffer.from(blob, "base64");
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
//# sourceMappingURL=prc20.js.map