import { ITestableERC20 } from "../../../common/__test__/utils/types";
import { Web3ERC20 } from "../../src/api/erc20";
import { IERC20ContractContext } from "../../types/token-standards/web3IERC20";
import { ContractContext as TERC20Contract } from "./types/web3tERC20";
import BN from "bn.js";

export class Web3TestableERC20 extends Web3ERC20 implements ITestableERC20<BN> {
  private _testContract: TERC20Contract;

  constructor(contract: TERC20Contract, signerAddress: string) {
    super(contract as unknown as IERC20ContractContext, signerAddress);
    this._testContract = contract;
  }

  async mint(amount: number): Promise<void> {
    const decimalAmount =
      await this._contractHelpers.contractTokenToDecimalAmount(amount, this);
    await this._testContract.methods
      .mint(decimalAmount.toString())
      .send({ from: this.getSignerAddress() });
  }

  async burnAll(): Promise<void> {
    await this._testContract.methods
      .burnAll()
      .send({ from: this.getSignerAddress() });
  }
}
