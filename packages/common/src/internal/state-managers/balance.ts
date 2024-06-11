import { BalanceStateContext } from "../../../types/internal/state-managers/balance";
import { IBalance } from "../../../types/token-standards";
import BN from "bn.js";

export class BalanceStateManager {
  private _contract: IBalance;

  constructor(contract: IBalance) {
    this._contract = contract;
  }

  public async getBalanceState(
    requiredBalance: BN,
    owner: string
  ): Promise<BalanceStateContext> {
    const currentBalance = await this._contract.balanceOf(owner);
    const balanceDifference = requiredBalance.sub(currentBalance);
    if (balanceDifference.lten(0)) {
      return { state: "sufficient-balance", data: undefined };
    }
    return { state: "insufficient-balance", data: balanceDifference };
  }
}
