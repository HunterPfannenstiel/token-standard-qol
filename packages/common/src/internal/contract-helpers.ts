import { IERC20 } from "../../types/token-standards/IERC20";
import {
  BigNumberConstructor,
  BigNumberish,
  IBigNumber,
} from "../../types/big-number";

export class ContractHelpers<T extends IBigNumber<T>> {
  constructor(private BigNumber: BigNumberConstructor<T>) {}
  //Math: The decimals field specifies how many decimal spaces the token supports (i.e. if decimals = 2, the token supports 2 decimal spaces. 100 would equal 1 token).
  //To convert a token amount to the correct units, the token amount needs to be multiplied by 10^decimals (1 * 10^2 = 100)
  decimalToTokenAmount(amount: BigNumberish<T>, decimals: BigNumberish<T>) {
    const amountBN = new this.BigNumber(amount);
    const decimalBN = new this.BigNumber(decimals);
    const baseBN = new this.BigNumber(10);
    const factor = baseBN.pow(decimalBN);

    const contractTokenAmount = amountBN.mul(factor);
    return contractTokenAmount as T;
  }

  tokenToDecimalAmount(amount: BigNumberish<T>, decimals: BigNumberish<T>) {
    const decimalBN = new this.BigNumber(decimals).mul(new this.BigNumber(-1));
    // const factor = new BN(10).pow(new BN(-decimals));
    return this.decimalToTokenAmount(amount, decimalBN);
  }

  async contractDecimalToTokenAmount(
    amount: BigNumberish<T>,
    contract: IERC20<T>
  ) {
    const decimals = await contract.decimals();
    const convertedAmount = this.decimalToTokenAmount(amount, decimals);
    return convertedAmount;
  }

  async contractTokenToDecimalAmount(
    amount: BigNumberish<T>,
    contract: IERC20<T>
  ) {
    const decimals = await contract.decimals();
    const convertedAmount = this.tokenToDecimalAmount(amount, decimals);
    return convertedAmount;
  }
}
