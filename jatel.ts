import SpeculosTransport from "@ledgerhq/hw-transport-node-speculos";
// import Transport from "@ledgerhq/hw-transport-node-hid";
import AppEth from "@ledgerhq/hw-app-eth";
import { TokenInfo, byContractAddress } from "@ledgerhq/hw-app-eth/erc20";


function getEth() : Promise<AppEth> {
    const apduPort = 9999;
    return  SpeculosTransport.open({ apduPort }).then((transport) => { return new AppEth(transport);});
}


const signEthTransaction = async (path: string, rawTxHex: string) => {
    const eth =  await getEth();
    const result = await eth.signTransaction(path, rawTxHex);
    return result;
};


const testTransaction = async () => {
    const tokenInfo = byContractAddress(
        "0xdac17f958d2ee523a2206206994597c13d831ec7"
      );
    const eth =  await getEth();
    await eth.provideERC20TokenInformation(tokenInfo as TokenInfo);
    const result = await eth.signTransaction(
        "44'/60'/0'/0/0",
        "f86d018504e3b2920082520894dac17f958d2ee523a2206206994597c13d831ec7872bd72a24874000b844095ea7b30000000000000000000000000102030405060708090a0b0c0d0e0f101112131400000000000000000000000000000000000000000000000000000000000186a0"
      );
    
      return result;

    // const result = await eth.signTransaction(
    //     "44'/60'/0'/0'/0",
    //     "e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080"
    //   );
    
    // return result;
}


testTransaction().then(a => console.log(a));