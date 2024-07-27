import { TokenFactory } from "../../../common/src/api/token-factory";
import { IERC20ContractContext } from "../../types/token-standards/web3IERC20";
import { Web3Helpers } from "../internal/helpers";
import { Web3ERC20 } from "./erc20";

export class Web3TokenFactory extends TokenFactory {
  async getERC20(tokenAddress: string, chainId: number): Promise<Web3ERC20> {
    const { contract, signer } = await Web3Helpers.createProviderContract(
      tokenAddress,
      chainId,
      this._erc20ABI.abi,
      this._provider
    );
    const erc20 = new Web3ERC20(
      contract as unknown as IERC20ContractContext,
      signer
    );
    return erc20;
  }
}
