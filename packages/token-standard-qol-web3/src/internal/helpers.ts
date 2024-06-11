import Web3, { Contract, ContractAbi } from "web3";
import { Provider } from "../../../common/types";

export class Web3Helpers {
  public static createContract<T extends ContractAbi>(
    address: string,
    chainId: number,
    signerAddress: string,
    abi: T
  ): Contract<T> {
    const contract = new Contract(abi, address);
    contract.defaultAccount = signerAddress;
    contract.defaultChain = chainId.toString();
    return contract;
  }

  public static async createProviderContract<T extends ContractAbi>(
    address: string,
    chainId: number,
    abi: T,
    provider: Provider,
    signerIndex = 0
  ) {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const signer = accounts[signerIndex];
    const contract = Web3Helpers.createContract(address, chainId, signer, abi);
    contract.setProvider(web3.provider);
    return { contract, web3, signer };
  }
}
