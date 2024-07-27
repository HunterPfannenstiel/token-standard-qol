import { ContractContext as TERC20Contract } from "./types/web3tERC20";
import { IERC20ContractContext } from "../../types/token-standards/web3IERC20";
import { Web3TestableERC20 } from "./testable-erc-20";
import { Provider } from "../../../common/types";
import { Web3ERC20 } from "../../src/api/erc20";
import { Web3Helpers } from "../../src/internal/helpers";
import { ContractHelpers } from "../../../common/src/internal/contract-helpers";
import BN from "bn.js";

export const getSignedERC20Contracts = async (
  address: string,
  chainId: number,
  abi: any,
  provider: Provider
) => {
  const { contract, signer } = await Web3Helpers.createProviderContract(
    address,
    chainId,
    abi,
    provider
  );
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

export const getContractHelpers = () => new ContractHelpers(BN);
