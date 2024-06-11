import { Provider } from "..";
import { StatefulERC20 } from "../../src/api/token-classes/stateful-erc20";
import { ISignedContract } from "../token-standards";
import { ERC20 } from "../token-standards/IERC20";

export type ContractConstructor<T extends ISignedContract> = (
  address: string,
  chainId: number,
  abi: any,
  providerURL: string
) => Promise<T>;

export interface ITokenFactory {
  getERC20(tokenAddress: string, chainId: number): Promise<ERC20>; //Provider through constructor
  getStatefulERC20(
    tokenAddress: string,
    chainId: number
  ): Promise<StatefulERC20>;
  // getERC721(tokenAddress: string, chainId: number): Promise<ERC721>;
  // getStatefulERC721(tokenAddress: string, chainId: number): Promise<StatefulERC721>
  // getERC1155(tokenAddress: string, chainId: number): Promise<ERC1155>;
  // getStatefulERC1155(tokenAddress: string, chainId: number): Promise<StatefulERC1155>
}
