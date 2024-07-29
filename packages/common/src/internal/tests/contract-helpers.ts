import { BigNumberConstructor, IBigNumber } from "../../../types/big-number";
import { ContractHelpers } from "../contract-helpers";

export const contractHelpersTests = (BigNumber: BigNumberConstructor<any>) => {
  const contractHelpers = new ContractHelpers(BigNumber);
  describe("decimal to token amount", () => {
    const tests = getDecimalToTokenTests(BigNumber);
    tests.nonFractional.forEach(({ number, decimals, expected }) => {
      it(`should convert numbers without fractional portion [${number}]`, () => {
        const tokenAmount = contractHelpers.decimalToTokenAmount(
          number,
          decimals
        );
        expect(tokenAmount.toString()).toBe(expected);
      });
    });
  });

  //   describe("token to decimal amount", () => {});

  //   describe("contract decimal to token amount", () => {});

  //   describe("contract token to decimal amount", () => {});
};

const getTokenTest =
  (BigNumber: BigNumberConstructor<IBigNumber<any>>) =>
  (number: number, decimals: number) => ({
    number,
    decimals,
    expected: new BigNumber(number)
      .mul(new BigNumber(10).pow(new BigNumber(decimals)))
      .toString(),
  });

const getDecimalToTokenTests = (BigNumber: BigNumberConstructor<any>) => {
  const createTokenTest = getTokenTest(BigNumber.bind(BigNumber));
  return {
    nonFractional: [
      createTokenTest(100, 2),
      createTokenTest(100, 3),
      createTokenTest(250, 3),
      createTokenTest(1, 0),
      createTokenTest(100, 0),
    ],
  };
};
