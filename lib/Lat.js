"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.__esModule = true;
/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/
// FIXME drop:
var utils_1 = require("./utils");
var logs_1 = require("@ledgerhq/logs");
var errors_1 = require("@ledgerhq/errors");
var ethers_1 = require("ethers");
var prc20_1 = require("./prc20");
var contracts_1 = require("./contracts");
var starkQuantizationTypeMap = {
    lat: 1,
    prc20: 2,
    prc721: 3,
    prc20mintable: 4,
    prc721mintable: 5
};
function hexBuffer(str) {
    return Buffer.from(str.startsWith("0x") ? str.slice(2) : str, "hex");
}
function maybeHexBuffer(str) {
    if (!str)
        return null;
    return hexBuffer(str);
}
var remapTransactionRelatedErrors = function (e) {
    if (e && e.statusCode === 0x6a80) {
        return new errors_1.LatAppPleaseEnableContractData("Please enable Contract data on the Lat app Settings");
    }
    return e;
};
/**
 * Lat API
 *
 * @example
 * import Lat from "@ledgerhq/hw-app-lat";
 * const eth = new Lat(transport)
 */
var Lat = /** @class */ (function () {
    function Lat(transport, scrambleKey) {
        if (scrambleKey === void 0) { scrambleKey = "w0w"; }
        this.transport = transport;
        transport.decorateAppAPIMethods(this, [
            "getAddress",
            "providePRC20TokenInformation",
            "signTransaction",
            "signPersonalMessage",
            "getAppConfiguration",
            "setExternalPlugin",
        ], scrambleKey);
    }
    /**
     * get Lat address for a given BIP 32 path.
     * @param path a path in BIP 32 format
     * @option boolDisplay optionally enable or not the display
     * @option boolChaincode optionally enable or not the chaincode request
     * @return an object with a publicKey, address and (optionally) chainCode
     * @example
     * eth.getAddress("44'/486'/0'/0/0").then(o => o.address)
     */
    Lat.prototype.getAddress = function (path, boolDisplay, boolChaincode) {
        var paths = utils_1.splitPath(path);
        var buffer = Buffer.alloc(1 + paths.length * 4);
        buffer[0] = paths.length;
        paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        return this.transport
            .send(0xe0, 0x02, boolDisplay ? 0x01 : 0x00, boolChaincode ? 0x01 : 0x00, buffer)
            .then(function (response) {
            var publicKeyLength = response[0];
            var addressLength = response[1 + publicKeyLength];
            return {
                publicKey: response.slice(1, 1 + publicKeyLength).toString("hex"),
                address: response
                    .slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength)
                    .toString("ascii"),
                chainCode: boolChaincode
                    ? response
                        .slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32)
                        .toString("hex")
                    : undefined
            };
        });
    };
    /**
     * This commands provides a trusted description of an PRC 20 token
     * to associate a contract address with a ticker and number of decimals.
     *
     * It shall be run immediately before performing a transaction involving a contract
     * calling this contract address to display the proper token information to the user if necessary.
     *
     * @param {*} info: a blob from "prc20.js" utilities that contains all token information.
     *
     * @example
     * import { byContractAddress } from "@ledgerhq/hw-app-lat/prc20"
     * const zrxInfo = byContractAddress("lax10jc0t4ndqarj4q6ujl3g3ycmufgc77epxg02lt")
     * if (zrxInfo) await appEth.providePRC20TokenInformation(zrxInfo)
     * const signed = await appEth.signTransaction(path, rawTxHex)
     */
    Lat.prototype.providePRC20TokenInformation = function (_a) {
        var data = _a.data;
        return providePRC20TokenInformation(this.transport, data);
    };
    /**
     * You can sign a transaction and retrieve v, r, s given the raw transaction and the BIP 32 path of the account to sign
     * @example
     eth.signTransaction("44'/486'/0'/0/0", "e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080").then(result => ...)
     */
    Lat.prototype.signTransaction = function (path, rawTxHex) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, offset, rawTx, toSend, response, rlpTx, rlpOffset, chainIdPrefix, rlpVrs, sizeOfListLen, chainIdSrc, chainIdBuf, _loop_1, decodedTx, provideForContract, selector, infos, plugin, payload, signature, prc20OfInterest, abi, contract, args, prc20OfInterest_1, prc20OfInterest_1_1, address, e_1_1;
            var e_1, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        paths = utils_1.splitPath(path);
                        offset = 0;
                        rawTx = Buffer.from(rawTxHex, "hex");
                        toSend = [];
                        rlpTx = ethers_1.ethers.utils.RLP.decode("0x" + rawTxHex).map(function (hex) {
                            return Buffer.from(hex.slice(2), "hex");
                        });
                        rlpOffset = 0;
                        chainIdPrefix = "";
                        if (rlpTx.length > 6) {
                            rlpVrs = Buffer.from(ethers_1.ethers.utils.RLP.encode(rlpTx.slice(-3)).slice(2), "hex");
                            rlpOffset = rawTx.length - (rlpVrs.length - 1);
                            // First byte > 0xf7 means the length of the list length doesn't fit in a single byte.
                            if (rlpVrs[0] > 0xf7) {
                                // Increment rlpOffset to account for that extra byte.
                                rlpOffset++;
                                sizeOfListLen = rlpVrs[0] - 0xf7;
                                // Increase rlpOffset by the size of the list length.
                                rlpOffset += sizeOfListLen - 1;
                            }
                            chainIdSrc = rlpTx[6];
                            chainIdBuf = Buffer.alloc(4);
                            chainIdSrc.copy(chainIdBuf, 4 - chainIdSrc.length);
                            chainIdPrefix = (chainIdBuf.readUInt32BE(0) * 2 + 35)
                                .toString(16)
                                .slice(0, -2);
                            // Drop the low byte, that comes from the ledger.
                            if (chainIdPrefix.length % 2 === 1) {
                                chainIdPrefix = "0" + chainIdPrefix;
                            }
                        }
                        _loop_1 = function () {
                            var maxChunkSize = offset === 0 ? 150 - 1 - paths.length * 4 : 150;
                            var chunkSize = offset + maxChunkSize > rawTx.length
                                ? rawTx.length - offset
                                : maxChunkSize;
                            if (rlpOffset != 0 && offset + chunkSize == rlpOffset) {
                                // Make sure that the chunk doesn't end right on the EIP 155 marker if set
                                chunkSize--;
                            }
                            var buffer = Buffer.alloc(offset === 0 ? 1 + paths.length * 4 + chunkSize : chunkSize);
                            if (offset === 0) {
                                buffer[0] = paths.length;
                                paths.forEach(function (element, index) {
                                    buffer.writeUInt32BE(element, 1 + 4 * index);
                                });
                                rawTx.copy(buffer, 1 + 4 * paths.length, offset, offset + chunkSize);
                            }
                            else {
                                rawTx.copy(buffer, 0, offset, offset + chunkSize);
                            }
                            toSend.push(buffer);
                            offset += chunkSize;
                        };
                        while (offset !== rawTx.length) {
                            _loop_1();
                        }
                        rlpTx = ethers_1.ethers.utils.RLP.decode("0x" + rawTxHex);
                        decodedTx = {
                            data: rlpTx[5],
                            to: rlpTx[3]
                        };
                        provideForContract = function (address) { return __awaiter(_this, void 0, void 0, function () {
                            var prc20Info;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        prc20Info = prc20_1.byContractAddress(address);
                                        if (!prc20Info) return [3 /*break*/, 2];
                                        logs_1.log("Lat", "loading prc20token info for " +
                                            prc20Info.contractAddress +
                                            " (" +
                                            prc20Info.ticker +
                                            ")");
                                        return [4 /*yield*/, providePRC20TokenInformation(this.transport, prc20Info.data)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!(decodedTx.data.length >= 10)) return [3 /*break*/, 14];
                        selector = decodedTx.data.substring(0, 10);
                        infos = contracts_1.getInfosForContractMethod(decodedTx.to, selector);
                        if (!infos) return [3 /*break*/, 11];
                        plugin = infos.plugin, payload = infos.payload, signature = infos.signature, prc20OfInterest = infos.prc20OfInterest, abi = infos.abi;
                        if (!plugin) return [3 /*break*/, 2];
                        logs_1.log("Lat", "loading plugin for " + selector);
                        return [4 /*yield*/, setExternalPlugin(this.transport, payload, signature)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!(prc20OfInterest && prc20OfInterest.length && abi)) return [3 /*break*/, 10];
                        contract = new ethers_1.ethers.utils.Interface(abi);
                        args = contract.parseTransaction(decodedTx).args;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 9, 10]);
                        prc20OfInterest_1 = __values(prc20OfInterest), prc20OfInterest_1_1 = prc20OfInterest_1.next();
                        _b.label = 4;
                    case 4:
                        if (!!prc20OfInterest_1_1.done) return [3 /*break*/, 7];
                        path = prc20OfInterest_1_1.value;
                        address = path.split(".").reduce(function (value, seg) {
                            if (seg === "-1" && Array.isArray(value)) {
                                return value[value.length - 1];
                            }
                            return value[seg];
                        }, args);
                        return [4 /*yield*/, provideForContract(address)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        prc20OfInterest_1_1 = prc20OfInterest_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (prc20OfInterest_1_1 && !prc20OfInterest_1_1.done && (_a = prc20OfInterest_1["return"])) _a.call(prc20OfInterest_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        logs_1.log("Lat", "no infos for selector " + selector);
                        _b.label = 12;
                    case 12: return [4 /*yield*/, provideForContract(decodedTx.to)];
                    case 13:
                        _b.sent();
                        _b.label = 14;
                    case 14: return [2 /*return*/, utils_1.foreach(toSend, function (data, i) {
                            return _this.transport
                                .send(0xe0, 0x04, i === 0 ? 0x00 : 0x80, 0x00, data)
                                .then(function (apduResponse) {
                                response = apduResponse;
                            });
                        }).then(function () {
                            var v = chainIdPrefix + response.slice(0, 1).toString("hex");
                            var r = response.slice(1, 1 + 32).toString("hex");
                            var s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
                            return {
                                v: v,
                                r: r,
                                s: s
                            };
                        }, function (e) {
                            throw remapTransactionRelatedErrors(e);
                        })];
                }
            });
        });
    };
    /**
     */
    Lat.prototype.getAppConfiguration = function () {
        return this.transport.send(0xe0, 0x06, 0x00, 0x00).then(function (response) {
            return {
                arbitraryDataEnabled: response[0] & 0x01,
                prc20ProvisioningNecessary: response[0] & 0x02,
                version: "" + response[1] + "." + response[2] + "." + response[3]
            };
        });
    };
    /**
    * You can sign a message according to eth_sign RPC call and retrieve v, r, s given the message and the BIP 32 path of the account to sign.
    * @example
    eth.signPersonalMessage("44'/486'/0'/0/0", Buffer.from("test").toString("hex")).then(result => {
    var v = result['v'] - 27;
    v = v.toString(16);
    if (v.length < 2) {
      v = "0" + v;
    }
    console.log("Signature 0x" + result['r'] + result['s'] + v);
    })
     */
    Lat.prototype.signPersonalMessage = function (path, messageHex) {
        var _this = this;
        var paths = utils_1.splitPath(path);
        var offset = 0;
        var message = Buffer.from(messageHex, "hex");
        var toSend = [];
        var response;
        var _loop_2 = function () {
            var maxChunkSize = offset === 0 ? 150 - 1 - paths.length * 4 - 4 : 150;
            var chunkSize = offset + maxChunkSize > message.length
                ? message.length - offset
                : maxChunkSize;
            var buffer = Buffer.alloc(offset === 0 ? 1 + paths.length * 4 + 4 + chunkSize : chunkSize);
            if (offset === 0) {
                buffer[0] = paths.length;
                paths.forEach(function (element, index) {
                    buffer.writeUInt32BE(element, 1 + 4 * index);
                });
                buffer.writeUInt32BE(message.length, 1 + 4 * paths.length);
                message.copy(buffer, 1 + 4 * paths.length + 4, offset, offset + chunkSize);
            }
            else {
                message.copy(buffer, 0, offset, offset + chunkSize);
            }
            toSend.push(buffer);
            offset += chunkSize;
        };
        while (offset !== message.length) {
            _loop_2();
        }
        return utils_1.foreach(toSend, function (data, i) {
            return _this.transport
                .send(0xe0, 0x08, i === 0 ? 0x00 : 0x80, 0x00, data)
                .then(function (apduResponse) {
                response = apduResponse;
            });
        }).then(function () {
            var v = response[0];
            var r = response.slice(1, 1 + 32).toString("hex");
            var s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
            return {
                v: v,
                r: r,
                s: s
            };
        });
    };
    /**
    * Sign a prepared message following web3.eth.signTypedData specification. The host computes the domain separator and hashStruct(message)
    * @example
    eth.signEIP712HashedMessage("44'/486'/0'/0/0", Buffer.from("0101010101010101010101010101010101010101010101010101010101010101").toString("hex"), Buffer.from("0202020202020202020202020202020202020202020202020202020202020202").toString("hex")).then(result => {
    var v = result['v'] - 27;
    v = v.toString(16);
    if (v.length < 2) {
      v = "0" + v;
    }
    console.log("Signature 0x" + result['r'] + result['s'] + v);
    })
     */
    Lat.prototype.signEIP712HashedMessage = function (path, domainSeparatorHex, hashStructMessageHex) {
        var domainSeparator = hexBuffer(domainSeparatorHex);
        var hashStruct = hexBuffer(hashStructMessageHex);
        var paths = utils_1.splitPath(path);
        var buffer = Buffer.alloc(1 + paths.length * 4 + 32 + 32, 0);
        var offset = 0;
        buffer[0] = paths.length;
        paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        offset = 1 + 4 * paths.length;
        domainSeparator.copy(buffer, offset);
        offset += 32;
        hashStruct.copy(buffer, offset);
        return this.transport
            .send(0xe0, 0x0c, 0x00, 0x00, buffer)
            .then(function (response) {
            var v = response[0];
            var r = response.slice(1, 1 + 32).toString("hex");
            var s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
            return {
                v: v,
                r: r,
                s: s
            };
        });
    };
    /**
     * Set the name of the plugin that should be used to parse the next transaction
     *
     * @param pluginName string containing the name of the plugin, must have length between 1 and 30 bytes
     * @return True if the method was executed successfully
     */
    Lat.prototype.setExternalPlugin = function (pluginName, contractAddress, selector) {
        return setExternalPlugin(this.transport, pluginName, selector);
    };
    return Lat;
}());
exports["default"] = Lat;
// internal helpers
function providePRC20TokenInformation(transport, data) {
    return transport.send(0xe0, 0x0a, 0x00, 0x00, data).then(function () { return true; }, function (e) {
        if (e && e.statusCode === 0x6d00) {
            // this case happen for older version of ETH app, since older app version had the PRC20 data hardcoded, it's fine to assume it worked.
            // we return a flag to know if the call was effective or not
            return false;
        }
        throw e;
    });
}
function setExternalPlugin(transport, payload, signature) {
    var payloadBuffer = Buffer.from(payload, "hex");
    var signatureBuffer = Buffer.from(signature, "hex");
    var buffer = Buffer.concat([payloadBuffer, signatureBuffer]);
    return transport.send(0xe0, 0x12, 0x00, 0x00, buffer).then(function () { return true; }, function (e) {
        if (e && e.statusCode === 0x6a80) {
            // this case happen when the plugin name is too short or too long
            return false;
        }
        else if (e && e.statusCode === 0x6984) {
            // this case happen when the plugin requested is not installed on the device
            return false;
        }
        else if (e && e.statusCode === 0x6d00) {
            // this case happen for older version of ETH app
            return false;
        }
        throw e;
    });
}
//# sourceMappingURL=Lat.js.map