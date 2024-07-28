import { IBigNumber } from "../../../types/big-number";
import { BalanceStateContext } from "../../../types/internal/state-managers/balance";
import { IBalance } from "../../../types/token-standards";

export class BalanceStateManager<T extends IBigNumber<T>> {
  private _contract: IBalance<T>;

  constructor(contract: IBalance<T>) {
    this._contract = contract;
  }

  public async getBalanceState(
    requiredBalance: T,
    owner: string
  ): Promise<BalanceStateContext<T>> {
    const currentBalance = await this._contract.balanceOf(owner);
    const balanceDifference = requiredBalance.sub(currentBalance);
    if (balanceDifference.lten(0)) {
      return { state: "sufficient-balance", data: undefined };
    }
    return { state: "insufficient-balance", data: balanceDifference as T };
  }
}
