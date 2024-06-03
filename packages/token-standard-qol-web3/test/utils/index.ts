import Web3 from "web3";
import { ProviderContractConstructor } from "../../../../common/test/utils/types";
import { Web3ContractConstructor } from "../../src/internal/contract-constructor";
import { ContractContext as TERC20Contract } from "./types/web3tERC20";
import { ITestableERC20 } from "../../../../common/test/utils/types";
import { Web3TestableERC20 } from "./testable-erc-20";

export const getSignedERC20: ProviderContractConstructor<
  ITestableERC20
> = async (address, chainId, abi, providerURL) => {
  const web3 = new Web3(providerURL);
  const accounts = await web3.eth.getAccounts();
  const signer = accounts[0];
  const contractConstructor = new Web3ContractConstructor(() => abi, signer);
  const contract = await contractConstructor.getContract(address, chainId);
  contract.setProvider(web3.provider);
  const testableERC20 = new Web3TestableERC20(
    contract as unknown as TERC20Contract,
    signer
  );

  return { contract: testableERC20, signerAddress: signer };
};
