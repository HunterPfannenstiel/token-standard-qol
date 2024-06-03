import {
  AllowanceStateContext,
  BalanceStateContext,
  TokenStateContext,
} from "../../types/state-manager";
import { IAllowance, IBalance } from "../../types/token-standards";
import BN from "bn.js";

export class AllowanceStateManager {
  private _contract: IAllowance;

  constructor(contract: IAllowance) {
    this._contract = contract;
  }

  public async getAllowanceState(
    requiredAllowance: BN,
    owner: string,
    spender: string
  ): Promise<AllowanceStateContext> {
    const currentAllowance = await this._contract.allowance(owner, spender);
    const allowanceDifference = requiredAllowance.sub(currentAllowance);
    if (allowanceDifference.lten(0)) {
      return { state: "sufficient-allowance", data: undefined };
    }
    return { state: "insufficient-allowance", data: allowanceDifference };
  }
}

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
