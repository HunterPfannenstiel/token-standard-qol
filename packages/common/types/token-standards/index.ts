import { AllowanceStateResponse } from "../internal/state-managers/allowance";
import { BalanceStateResponse } from "../internal/state-managers/balance";
import { BigNumberish, IBigNumber } from "../big-number";

export interface IAllowance<T extends IBigNumber<T>> {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _spender Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   */
  approve(_spender: string, _value: BigNumberish<T>): Promise<void>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _owner Type: address, Indexed: false
   * @param _spender Type: address, Indexed: false
   */
  allowance(_owner: string, _spender: string): Promise<T>;
}

export interface IStatefulAllowance<T extends IBigNumber<T>> {
  getAllowanceState(
    requiredAmount: number,
    spender: string
  ): Promise<AllowanceStateResponse<T>>;
}

export interface IBalance<T extends IBigNumber<T>> {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _owner Type: address, Indexed: false
   */
  balanceOf(_owner: string): Promise<T>;
}

export interface IStatefulBalance<T extends IBigNumber<T>> {
  getBalanceState(requiredAmount: number): Promise<BalanceStateResponse<T>>;
}

export interface ISignedContract {
  getSignerAddress(): string;
  setSignerAddress(address: string): void;
}

export class SignedContract implements ISignedContract {
  private _signerAddress: string;
  constructor(signerAddress: string) {
    this._signerAddress = signerAddress;
  }

  public getSignerAddress() {
    return this._signerAddress;
  }

  public setSignerAddress(address: string) {
    this._signerAddress = address;
  }
}
