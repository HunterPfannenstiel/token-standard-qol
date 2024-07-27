import { IBigNumber } from "../../../types/big-number";
import { TokenStateContext } from "../../../types/internal/state-managers/token";
import { AllowanceStateManager } from "./allowance";
import { BalanceStateManager } from "./balance";

export class StateManagerHelpers {
  static async balanceAllowanceState<T extends IBigNumber<T>>(
    allowanceManager: AllowanceStateManager<T>,
    balanceManager: BalanceStateManager<T>,
    requiredAmount: T,
    owner: string,
    spender: string
  ): Promise<TokenStateContext<T>> {
    const balanceState = await balanceManager.getBalanceState(
      requiredAmount,
      owner
    );
    if (balanceState.state === "sufficient-balance") {
      const allowanceState = await allowanceManager.getAllowanceState(
        requiredAmount,
        owner,
        spender
      );
      if (allowanceState.state === "sufficient-allowance") {
        return { state: "sufficient", data: undefined };
      }
      return allowanceState;
    }
    return balanceState;
  }
}
