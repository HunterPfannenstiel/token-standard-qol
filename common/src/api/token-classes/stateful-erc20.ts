import { NetworkResponse } from "../../../types";
import {
  BalanceStateResponse,
  AllowanceStateResponse,
  TokenStateResponse,
} from "../../../types/state-manager";
import { ERC20, IStatefulERC20 } from "../../../types/token-standards/IERC20";
import { NetworkRequestHandler } from "../../internal/network-request-handler";
import BN from "bn.js";
import {
  AllowanceStateManager,
  BalanceStateManager,
  StateManagerHelpers,
} from "../../internal/state-managers";

export class StatefulERC20 implements IStatefulERC20 {
  private _balanceManager: BalanceStateManager;
  private _allowanceManager: AllowanceStateManager;
  protected _erc20: ERC20;

  constructor(erc20: ERC20) {
    this._erc20 = erc20;
    this._balanceManager = new BalanceStateManager(this._erc20);
    this._allowanceManager = new AllowanceStateManager(this._erc20);
  }

  protected async tokenToDecimalAmount(requiredAmount: number) {
    return NetworkRequestHandler.send(async () => {
      return this._erc20.tokenToDecimalAmount(requiredAmount);
    });
  }

  public async cTotalSupply(): Promise<NetworkResponse<BN>> {
    return NetworkRequestHandler.send(async () => this._erc20.cTotalSupply());
  }

  public async cBalanceOf(_owner: string): Promise<NetworkResponse<BN>> {
    return NetworkRequestHandler.send(async () =>
      this._erc20.cBalanceOf(_owner)
    );
  }

  public async cAllowance(
    _owner: string,
    _spender: string
  ): Promise<NetworkResponse<BN>> {
    return NetworkRequestHandler.send(async () =>
      this._erc20.cAllowance(_owner, _spender)
    );
  }

  name(): Promise<NetworkResponse<string>> {
    return NetworkRequestHandler.send(this._erc20.name);
  }

  approve(_spender: string, _value: number): Promise<NetworkResponse<void>> {
    return NetworkRequestHandler.send(
      this._erc20.approve.bind(this._erc20, _spender, _value)
    );
  }

  totalSupply(): Promise<NetworkResponse<BN>> {
    return NetworkRequestHandler.send(this._erc20.totalSupply);
  }

  transferFrom(
    _from: string,
    _to: string,
    _value: number
  ): Promise<NetworkResponse<void>> {
    return NetworkRequestHandler.send(
      this._erc20.transferFrom.bind(this._erc20, _from, _to, _value)
    );
  }

  decimals(): Promise<NetworkResponse<number>> {
    return NetworkRequestHandler.send(this._erc20.decimals);
  }

  balanceOf(_owner: string): Promise<NetworkResponse<BN>> {
    return NetworkRequestHandler.send(
      this._erc20.balanceOf.bind(this._erc20, _owner)
    );
  }

  symbol(): Promise<NetworkResponse<string>> {
    return NetworkRequestHandler.send(this._erc20.symbol);
  }

  transfer(_to: string, _value: number): Promise<NetworkResponse<void>> {
    return NetworkRequestHandler.send(
      this._erc20.transfer.bind(this._erc20, _to, _value)
    );
  }

  allowance(_owner: string, _spender: string): Promise<NetworkResponse<BN>> {
    return NetworkRequestHandler.send(
      this._erc20.allowance.bind(this._erc20, _owner, _spender)
    );
  }

  async getBalanceState(requiredAmount: number): Promise<BalanceStateResponse> {
    const conversionRequest = await this.tokenToDecimalAmount(requiredAmount);

    if (conversionRequest.isError) return conversionRequest;

    const requiredBalance = conversionRequest.data;
    return NetworkRequestHandler.send(async () => {
      return this._balanceManager.getBalanceState(
        requiredBalance,
        this._erc20.getSignerAddress()
      );
    });
  }

  async getAllowanceState(
    requiredAmount: number,
    spender: string
  ): Promise<AllowanceStateResponse> {
    const conversionRequest = await this.tokenToDecimalAmount(requiredAmount);

    if (conversionRequest.isError) return conversionRequest;

    const requiredAllowance = conversionRequest.data;
    return NetworkRequestHandler.send(async () => {
      return this._allowanceManager.getAllowanceState(
        requiredAllowance,
        this._erc20.getSignerAddress(),
        spender
      );
    });
  }

  async getTokenState(
    requiredAmount: number,
    spender: string
  ): Promise<TokenStateResponse> {
    const conversionRequest = await this.tokenToDecimalAmount(requiredAmount);

    if (conversionRequest.isError) return conversionRequest;

    const requiredAmountBN = conversionRequest.data;
    const balanceAllowanceStateRequest = await NetworkRequestHandler.send(
      async () =>
        StateManagerHelpers.balanceAllowanceState(
          this._allowanceManager,
          this._balanceManager,
          requiredAmountBN,
          this._erc20.getSignerAddress(),
          spender
        )
    );
    return balanceAllowanceStateRequest;
  }
}