import Web3 from "web3";
import { ContractContext as TERC20Contract } from "./types/web3tERC20";
import { IERC20ContractContext } from "../../types/token-standards/web3IERC20";
import { Web3TestableERC20 } from "./testable-erc-20";
import { Web3ERC20 } from "../../src/api/erc20";
import { Web3Helpers } from "../../src/internal/helpers";
import { Provider } from "../../../common/types";

export const getSignedERC20Contracts = async (
  address: string,
  chainId: number,
  abi: any,
  providerURL: Provider
) => {
  const web3 = new Web3(providerURL);
  const accounts = await web3.eth.getAccounts();
  const signer = accounts[0];
  const contract = Web3Helpers.createContract(address, chainId, signer, abi);
  contract.setProvider(web3.provider);
  const testableERC20 = new Web3TestableERC20(
    contract as unknown as TERC20Contract,
    signer
  );
  const erc20 = new Web3ERC20(
    contract as unknown as IERC20ContractContext,
    signer
  );

  return {
    testable: { contract: testableERC20, signerAddress: signer },
    erc20: { contract: erc20, signerAddress: signer },
  };
};
