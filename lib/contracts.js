"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getInfosForContractMethod = void 0;
var ethereum_1 = __importDefault(require("@ledgerhq/cryptoassets/data/dapps/ethereum"));
/**
 * Retrieve the metadatas a given contract address and a method selector
 */
var getInfosForContractMethod = function (contractAddress, selector) {
    var lcSelector = selector.toLowerCase();
    var lcContractAddress = contractAddress.toLowerCase();
    if (lcContractAddress in ethereum_1["default"]) {
        var contractSelectors = ethereum_1["default"][lcContractAddress];
        if (lcSelector in contractSelectors) {
            return {
                payload: contractSelectors[lcSelector]["serialized_data"],
                signature: contractSelectors[lcSelector]["signature"],
                plugin: contractSelectors[lcSelector]["plugin"],
                prc20OfInterest: contractSelectors[lcSelector]["erc20OfInterest"],
                abi: contractSelectors["abi"]
            };
        }
    }
};
exports.getInfosForContractMethod = getInfosForContractMethod;
//# sourceMappingURL=contracts.js.map