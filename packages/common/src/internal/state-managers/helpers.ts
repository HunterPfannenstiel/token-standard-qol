import { TokenStateContext } from "../../../types/internal/state-managers/token";
import { AllowanceStateManager } from "./allowance";
import { BalanceStateManager } from "./balance";
import BN from "bn.js";

export class StateManagerHelpers {
  static async balanceAllowanceState(
    allowanceManager: AllowanceStateManager,
    balanceManager: BalanceStateManager,
    requiredAmount: BN,
    owner: string,
    spender: string
  ): Promise<TokenStateContext> {
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
