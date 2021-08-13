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
exports.__esModule = true;
var hw_transport_node_speculos_1 = require("@ledgerhq/hw-transport-node-speculos");
// import Transport from "@ledgerhq/hw-transport-node-hid";
var hw_app_eth_1 = require("@ledgerhq/hw-app-eth");
var erc20_1 = require("@ledgerhq/hw-app-eth/erc20");
function getEth() {
    var apduPort = 9999;
    return hw_transport_node_speculos_1["default"].open({ apduPort: apduPort }).then(function (transport) { return new hw_app_eth_1["default"](transport); });
}
var signEthTransaction = function (path, rawTxHex) { return __awaiter(void 0, void 0, void 0, function () {
    var eth, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getEth()];
            case 1:
                eth = _a.sent();
                return [4 /*yield*/, eth.signTransaction(path, rawTxHex)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
var testTransaction = function () { return __awaiter(void 0, void 0, void 0, function () {
    var tokenInfo, eth, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenInfo = erc20_1.byContractAddress("0xdac17f958d2ee523a2206206994597c13d831ec7");
                return [4 /*yield*/, getEth()];
            case 1:
                eth = _a.sent();
                return [4 /*yield*/, eth.provideERC20TokenInformation(tokenInfo)];
            case 2:
                _a.sent();
                return [4 /*yield*/, eth.signTransaction("44'/60'/0'/0/0", "f86d018504e3b2920082520894dac17f958d2ee523a2206206994597c13d831ec7872bd72a24874000b844095ea7b30000000000000000000000000102030405060708090a0b0c0d0e0f101112131400000000000000000000000000000000000000000000000000000000000186a0")];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
testTransaction().then(function (a) { return console.log(a); });
