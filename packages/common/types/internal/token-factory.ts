import { Provider } from "..";
import { ISignedContract } from "../token-standards";
import { ERC20 } from "../token-standards/IERC20";

export type ContractConstructor<T extends ISignedContract> = (
  address: string,
  chainId: number,
  abi: any,
  providerURL: string
) => Promise<T>;

export interface ITokenFactory {
  getERC20(tokenAddress: string, chainId: number, provider: Provider): ERC20;
}
