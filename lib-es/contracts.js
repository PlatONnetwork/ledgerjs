import data from "@ledgerhq/cryptoassets/data/dapps/ethereum";
/**
 * Retrieve the metadatas a given contract address and a method selector
 */
export var getInfosForContractMethod = function (contractAddress, selector) {
    var lcSelector = selector.toLowerCase();
    var lcContractAddress = contractAddress.toLowerCase();
    if (lcContractAddress in data) {
        var contractSelectors = data[lcContractAddress];
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
//# sourceMappingURL=contracts.js.map