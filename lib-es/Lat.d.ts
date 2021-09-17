/// <reference types="node" />
import type Transport from "@ledgerhq/hw-transport";
export declare type StarkQuantizationType = "lat" | "prc20" | "prc721" | "prc20mintable" | "prc721mintable";
/**
 * Lat API
 *
 * @example
 * import Lat from "@ledgerhq/hw-app-lat";
 * const eth = new Lat(transport)
 */
export default class Lat {
    transport: Transport;
    constructor(transport: Transport, scrambleKey?: string);
    /**
     * get Lat address for a given BIP 32 path.
     * @param path a path in BIP 32 format
     * @option boolDisplay optionally enable or not the display
     * @option boolChaincode optionally enable or not the chaincode request
     * @return an object with a publicKey, address and (optionally) chainCode
     * @example
     * eth.getAddress("44'/486'/0'/0/0").then(o => o.address)
     */
    getAddress(path: string, boolDisplay?: boolean, boolChaincode?: boolean): Promise<{
        publicKey: string;
        address: string;
        chainCode?: string;
    }>;
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
    providePRC20TokenInformation({ data }: {
        data: Buffer;
    }): Promise<boolean>;
    /**
     * You can sign a transaction and retrieve v, r, s given the raw transaction and the BIP 32 path of the account to sign
     * @example
     eth.signTransaction("44'/486'/0'/0/0", "e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080").then(result => ...)
     */
    signTransaction(path: string, rawTxHex: string): Promise<{
        s: string;
        v: string;
        r: string;
    }>;
    /**
     */
    getAppConfiguration(): Promise<{
        arbitraryDataEnabled: number;
        prc20ProvisioningNecessary: number;
        version: string;
    }>;
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
    signPersonalMessage(path: string, messageHex: string): Promise<{
        v: number;
        s: string;
        r: string;
    }>;
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
    signEIP712HashedMessage(path: string, domainSeparatorHex: string, hashStructMessageHex: string): Promise<{
        v: number;
        s: string;
        r: string;
    }>;
    /**
     * Set the name of the plugin that should be used to parse the next transaction
     *
     * @param pluginName string containing the name of the plugin, must have length between 1 and 30 bytes
     * @return True if the method was executed successfully
     */
    setExternalPlugin(pluginName: string, contractAddress: string, selector: string): Promise<boolean>;
}
//# sourceMappingURL=Lat.d.ts.map