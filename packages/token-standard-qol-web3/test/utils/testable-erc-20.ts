import { ContractHelpers } from "../../../common/src/internal/contract-helpers";
import { ITestableERC20 } from "../../../common/test/utils/types";
import { Web3ERC20 } from "../../src/api/erc20";
import { IERC20ContractContext } from "../../types/token-standards/web3IERC20";
import { ContractContext as TERC20Contract } from "./types/web3tERC20";

export class Web3TestableERC20 extends Web3ERC20 implements ITestableERC20 {
  private _testContract: TERC20Contract;

  constructor(contract: TERC20Contract, signerAddress: string) {
    super(contract as unknown as IERC20ContractContext, signerAddress);
    this._testContract = contract;
  }

  async mint(amount: number): Promise<void> {
    const decimalAmount = await ContractHelpers.contractTokenToDecimalAmount(
      amount,
      this
    );
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
