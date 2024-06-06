import BN from "bn.js";

import { ERC20 } from "../../../../common/types/token-standards/IERC20";
import { IERC20ContractContext } from "../../types/token-standards/web3IERC20";
// import { Web3Error } from "web3";

export class Web3ERC20 extends ERC20 {
  private _cachedDecimals?: number;
  protected _contract: IERC20ContractContext;
  constructor(contract: IERC20ContractContext, signerAddress: string) {
    super(signerAddress);
    this._contract = contract;
  }

  async name() {
    return this._contract.methods.name().call();
  }

  async approve(_spender: string, _value: number) {
    const convertedAmount = await this.tokenToDecimalAmount(_value);
    await this._contract.methods
      .approve(_spender, convertedAmount.toString())
      .send({ from: this.getSignerAddress() });
  }

  async totalSupply() {
    const supplyString = await this._contract.methods.totalSupply().call();
    return new BN(supplyString);
  }

  async transferFrom(_from: string, _to: string, _value: number) {
    const convertedAmount = await this.tokenToDecimalAmount(_value);
    await this._contract.methods
      .transferFrom(_from, _to, convertedAmount.toString())
      .send({ from: this.getSignerAddress() });
  }

  async decimals() {
    if (this._cachedDecimals !== undefined) {
      return this._cachedDecimals;
    }

    const decimalString = await this._contract.methods.decimals().call();
    const decimals = parseInt(decimalString);
    this._cachedDecimals = decimals;
    return decimals;
  }

  async balanceOf(_owner: string) {
    const balanceString = await this._contract.methods.balanceOf(_owner).call();
    return new BN(balanceString);
  }

  async symbol() {
    return this._contract.methods.symbol().call();
  }

  async transfer(_to: string, _value: number) {
    const convertedAmount = await this.tokenToDecimalAmount(_value);
    await this._contract.methods
      .transfer(_to, convertedAmount.toString())
      .send({ from: this.getSignerAddress() });
  }

  async allowance(_owner: string, _spender: string) {
    const allowanceString = await this._contract.methods
      .allowance(_owner, _spender)
      .call();
    return new BN(allowanceString);
  }
}
