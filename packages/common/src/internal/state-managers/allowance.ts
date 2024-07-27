import { IBigNumber } from "../../../types/big-number";
import { AllowanceStateContext } from "../../../types/internal/state-managers/allowance";
import { IAllowance } from "../../../types/token-standards";

export class AllowanceStateManager<T extends IBigNumber<T>> {
  private _contract: IAllowance<T>;

  constructor(contract: IAllowance<T>) {
    this._contract = contract;
  }

  public async getAllowanceState(
    requiredAllowance: T,
    owner: string,
    spender: string
  ): Promise<AllowanceStateContext<T>> {
    const currentAllowance = await this._contract.allowance(owner, spender);
    const allowanceDifference = requiredAllowance.sub(currentAllowance);
    if (allowanceDifference.lten(0)) {
      return { state: "sufficient-allowance", data: undefined };
    }
    return { state: "insufficient-allowance", data: allowanceDifference as T };
  }
}
