import { Contract } from "web3";

export class Web3ContractConstructor {
  constructor(private signerAddress: string) {}

  public async getContract(address: string, chainId: number, abi: any) {
    const contract = new Contract(abi, address);
    contract.defaultAccount = this.signerAddress;
    contract.defaultChain = chainId.toString();
    return contract;
  }
}
