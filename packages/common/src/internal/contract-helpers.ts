import { IERC20 } from "../../types/token-standards/IERC20";
import {
  BigNumberConstructor,
  BigNumberish,
  IBigNumber,
} from "../../types/big-number";
import { splitDecimalNumber } from "../shared/decimal-utils";

export class ContractHelpers<T extends IBigNumber<T>> {
  constructor(private BigNumber: BigNumberConstructor<T>) {}

  private adjustFraction(fraction: string, decimalCount: number) {
    if (fraction.length < decimalCount) {
      return fraction.padEnd(decimalCount, "0");
    }

    return fraction.slice(0, decimalCount);
  }
  //Math: The decimals field specifies how many decimal spaces the token supports (i.e. if decimals = 2, the token supports 2 decimal spaces. 100 would equal 1 token).
  //To convert a token amount to the correct units, the token amount needs to be multiplied by 10^decimals (1 * 10^2 = 100)
  decimalToTokenAmount(amount: BigNumberish<T>, decimals: number) {
    const numberString = amount.toString();
    const { whole, fraction } = splitDecimalNumber(numberString);

    const adjustedFraction = this.adjustFraction(fraction, decimals);
    const tokenAmount = whole + adjustedFraction;
    return new this.BigNumber(tokenAmount);
  }

  tokenToDecimalAmount(amount: BigNumberish<T>, decimals: number): string {
    const amountString = amount.toString();
    const whole =
      amountString.substring(0, amountString.length - decimals) || "0";
    const fraction = amountString.substring(amountString.length - decimals);
    return `${whole}.${fraction}`;
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
