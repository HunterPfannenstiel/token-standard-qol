import BN from "bn.js";
import { IERC20 } from "../../types/token-standards/IERC20";

export class ContractHelpers {
  //Math: The decimals field specifies how many decimal spaces the token supports (i.e. if decimals = 2, the token supports 2 decimal spaces. 100 would equal 1 token).
  //To convert a token amount to the correct units, the token amount needs to be multiplied by 10^decimals (1 * 10^2 = 100)
  static tokenToDecimalAmount(amount: number | BN | string, decimals: number) {
    const tokenAmount = new BN(amount);
    const factor = new BN(10).pow(new BN(decimals));

    const contractTokenAmount = tokenAmount.mul(factor);
    return contractTokenAmount;
  }

  static decimalToTokenAmount(amount: number | BN | string, decimals: number) {
    const decimalAmount = new BN(amount);
    const factor = new BN(10).pow(new BN(-decimals));

    const tokenAmount = decimalAmount.mul(factor);
    return tokenAmount;
  }

  static async contractTokenToDecimalAmount(
    amount: number | BN | string,
    contract: IERC20
  ) {
    const decimals = await contract.decimals();
    const convertedAmount = ContractHelpers.tokenToDecimalAmount(
      amount,
      decimals
    );
    return convertedAmount;
  }

  static async contractDecimalToTokenAmount(
    amount: number | BN | string,
    contract: IERC20
  ) {
    const decimals = await contract.decimals();
    const convertedAmount = ContractHelpers.decimalToTokenAmount(
      amount,
      decimals
    );
    return convertedAmount;
  }
}

const getDecimalCount = (amount: number | BN | string) => {
  const amountString = amount.toString();
  const decimalIndex = amountString.indexOf(".");
  if (decimalIndex === -1) return 0;
  return amountString.length - decimalIndex - 1;
};
