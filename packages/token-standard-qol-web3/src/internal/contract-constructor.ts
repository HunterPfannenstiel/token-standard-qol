import { Contract, ContractAbi } from "web3";
import { ABIDelegate } from "../../../../common/types";
import { IContractConstructor } from "../../../../common/types/contract-constructor";

export class Web3ContractConstructor
  implements IContractConstructor<Contract<any>>
{
  constructor(
    private abiDelegate: ABIDelegate,
    private signerAddress: string
  ) {}

  public async getContract(address: string, chainId: number) {
    const abi = await this.abiDelegate(address);
    const contract = new Contract(abi, address);
    contract.defaultAccount = this.signerAddress;
    contract.defaultChain = chainId.toString();
    return contract;
  }
}
