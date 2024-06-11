import { AllowanceStateContext } from "../../../types/state-manager";
import { IAllowance } from "../../../types/token-standards";
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
