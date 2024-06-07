import { NetworkResponse } from "..";
import BN from "bn.js";
import { ContractHelpers } from "../../src/internal/contract-helpers";
import {
  IAllowance,
  IBalance,
  IStatefulAllowance,
  IStatefulBalance,
  SignedContract,
} from ".";
import { TokenStateResponse } from "../state-manager";

export interface IERC20 extends IAllowance, IBalance {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(): Promise<BN>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _from Type: address, Indexed: false
   * @param _to Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   */
  transferFrom(_from: string, _to: string, _value: number): Promise<void>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  decimals(): Promise<number>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _to Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   */
  transfer(_to: string, _value: number): Promise<void>;
}

export interface IStatefulERC20 extends IStatefulBalance, IStatefulAllowance {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(): Promise<NetworkResponse<string>>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _spender Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   */
  approve(_spender: string, _value: number): Promise<NetworkResponse<void>>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(): Promise<NetworkResponse<BN>>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _from Type: address, Indexed: false
   * @param _to Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   */
  transferFrom(
    _from: string,
    _to: string,
    _value: number
  ): Promise<NetworkResponse<void>>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  decimals(): Promise<NetworkResponse<number>>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _owner Type: address, Indexed: false
   */
  balanceOf(_owner: string): Promise<NetworkResponse<BN>>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(): Promise<NetworkResponse<string>>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _to Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   */
  transfer(_to: string, _value: number): Promise<NetworkResponse<void>>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _owner Type: address, Indexed: false
   * @param _spender Type: address, Indexed: false
   */
  allowance(_owner: string, _spender: string): Promise<NetworkResponse<BN>>;

  getTokenState(
    requiredAmount: number,
    spender: string
  ): Promise<TokenStateResponse>;
}

export abstract class ERC20 extends SignedContract implements IERC20 {
  public async tokenToDecimalAmount(amount: string | number | BN) {
    return ContractHelpers.contractTokenToDecimalAmount(amount, this);
  }

  public async decimalToTokenAmount(amount: string | number | BN) {
    return ContractHelpers.contractDecimalToTokenAmount(amount, this);
  }

  public async cTotalSupply(): Promise<BN> {
    const totalSupply = await this.totalSupply();
    return this.decimalToTokenAmount(totalSupply);
  }

  public async cBalanceOf(_owner: string): Promise<BN> {
    const balance = await this.balanceOf(_owner);
    return this.decimalToTokenAmount(balance);
  }

  public async cAllowance(_owner: string, _spender: string): Promise<BN> {
    const allowance = await this.allowance(_owner, _spender);
    return this.decimalToTokenAmount(allowance);
  }

  abstract name(): Promise<string>;
  abstract approve(_spender: string, _value: number): Promise<void>;
  abstract totalSupply(): Promise<BN>;
  abstract transferFrom(
    _from: string,
    _to: string,
    _value: number
  ): Promise<void>;
  abstract decimals(): Promise<number>;
  abstract balanceOf(_owner: string): Promise<BN>;
  abstract symbol(): Promise<string>;
  abstract transfer(_to: string, _value: number): Promise<void>;
  abstract allowance(_owner: string, _spender: string): Promise<BN>;
}
