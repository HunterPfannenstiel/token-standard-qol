import { Provider } from "../../types";
import { ITokenFactory } from "../../types/internal/token-factory";
import { ERC20Conversions } from "../../types/token-standards/IERC20";
import { StatefulERC20 } from "./token-classes/stateful-erc20";
import * as ERC20ABI from "../../ABI/ERC20.json";
import { IBigNumber } from "../../types/big-number";

export abstract class TokenFactory<T extends IBigNumber<T>, E>
  implements ITokenFactory
{
  protected _provider: Provider;
  protected _erc20ABI = ERC20ABI;
  constructor(provider: Provider) {
    this._provider = provider;
  }

  abstract getERC20(
    tokenAddress: string,
    chainId: number
  ): Promise<ERC20Conversions<T>>;

  async getStatefulERC20(
    tokenAddress: string,
    chainId: number
  ): Promise<StatefulERC20<T, E>> {
    const erc20 = await this.getERC20(tokenAddress, chainId);
    const statefulERC20 = new StatefulERC20(erc20);
    return statefulERC20;
  }
}
