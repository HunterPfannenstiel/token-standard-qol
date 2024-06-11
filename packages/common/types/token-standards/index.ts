import BN from "bn.js";
import { AllowanceStateResponse } from "../internal/state-managers/allowance";
import { BalanceStateResponse } from "../internal/state-managers/balance";

export interface IAllowance {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _spender Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   */
  approve(_spender: string, _value: number): Promise<void>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _owner Type: address, Indexed: false
   * @param _spender Type: address, Indexed: false
   */
  allowance(_owner: string, _spender: string): Promise<BN>;
}

export interface IStatefulAllowance {
  getAllowanceState(
    requiredAmount: number,
    spender: string
  ): Promise<AllowanceStateResponse>;
}

export interface IBalance {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _owner Type: address, Indexed: false
   */
  balanceOf(_owner: string): Promise<BN>;
}

export interface IStatefulBalance {
  getBalanceState(requiredAmount: number): Promise<BalanceStateResponse>;
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
