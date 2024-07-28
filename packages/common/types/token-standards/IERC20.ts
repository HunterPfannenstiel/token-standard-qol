import { NetworkResponse } from "..";
import { ContractHelpers } from "../../src/internal/contract-helpers";
import {
  IAllowance,
  IBalance,
  IStatefulAllowance,
  IStatefulBalance,
  SignedContract,
} from ".";
import { TokenStateResponse } from "../internal/state-managers/token";
import { BigNumberConstructor, BigNumberish, IBigNumber } from "../big-number";

export interface IERC20<T extends IBigNumber<T>>
  extends IAllowance<T>,
    IBalance<T> {
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
  totalSupply(): Promise<T>;
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
    _value: BigNumberish<T>
  ): Promise<void>;
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
  transfer(_to: string, _value: BigNumberish<T>): Promise<void>;
}

export interface IStatefulERC20<T extends IBigNumber<T>>
  extends IStatefulBalance<T>,
    IStatefulAllowance<T> {
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
  approve(
    _spender: string,
    _value: BigNumberish<T>
  ): Promise<NetworkResponse<void>>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(): Promise<NetworkResponse<T>>;
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
    _value: BigNumberish<T>
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
  balanceOf(_owner: string): Promise<NetworkResponse<T>>;
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
  transfer(
    _to: string,
    _value: BigNumberish<T>
  ): Promise<NetworkResponse<void>>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _owner Type: address, Indexed: false
   * @param _spender Type: address, Indexed: false
   */
  allowance(_owner: string, _spender: string): Promise<NetworkResponse<T>>;

  getTokenState(
    requiredAmount: BigNumberish<T>,
    spender: string
  ): Promise<TokenStateResponse<T>>;
}

export abstract class ERC20<T extends IBigNumber<T>>
  extends SignedContract
  implements IERC20<T>
{
  private _cachedDecimals?: number;
  private async getDecimals() {
    if (this._cachedDecimals !== undefined) {
      return this._cachedDecimals;
    }
    const decimals = await this.fetchDecimals();
    this._cachedDecimals = decimals;
    return decimals;
  }

  public decimals(): Promise<number> {
    return this.getDecimals();
  }

  abstract name(): Promise<string>;
  abstract approve(_spender: string, _value: BigNumberish<T>): Promise<void>;
  abstract totalSupply(): Promise<T>;
  abstract transferFrom(
    _from: string,
    _to: string,
    _value: BigNumberish<T>
  ): Promise<void>;
  protected abstract fetchDecimals(): Promise<number>;
  abstract balanceOf(_owner: string): Promise<T>;
  abstract symbol(): Promise<string>;
  abstract transfer(_to: string, _value: BigNumberish<T>): Promise<void>;
  abstract allowance(_owner: string, _spender: string): Promise<T>;
}

export abstract class ERC20Conversions<
  T extends IBigNumber<T>
> extends ERC20<T> {
  protected _contractHelpers: ContractHelpers<T>;
  constructor(signerAddress: string, bnConstructor: BigNumberConstructor<T>) {
    super(signerAddress);
    this._contractHelpers = new ContractHelpers(bnConstructor);
  }

  public async tokenToDecimalAmount(amount: BigNumberish<T>) {
    return this._contractHelpers.contractTokenToDecimalAmount(amount, this);
  }

  public async decimalToTokenAmount(amount: BigNumberish<T>) {
    return this._contractHelpers.contractDecimalToTokenAmount(amount, this);
  }

  public async cTotalSupply(): Promise<T> {
    const totalSupply = await this.totalSupply();
    return this.decimalToTokenAmount(totalSupply);
  }

  public async cBalanceOf(_owner: string): Promise<T> {
    const balance = await this.balanceOf(_owner);
    return this.decimalToTokenAmount(balance);
  }

  public async cAllowance(_owner: string, _spender: string): Promise<T> {
    const allowance = await this.allowance(_owner, _spender);
    return this.decimalToTokenAmount(allowance);
  }
}
