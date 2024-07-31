import {
  BigNumberConstructor,
  BigNumberish,
} from "../../../../types/big-number";
import { ContractHelpers } from "../../contract-helpers";
import { getDecimalToTokenTests } from "./utils";

const runDecimalToTokenAmountTest = (
  contractHelpers: ContractHelpers<any>,
  testName: string,
  number: BigNumberish<any>,
  decimals: number,
  expected: BigNumberish<any>,
  showTestParams = false
) => {
  const testParamsDisplay = showTestParams
    ? `[Number: ${number}; Decimals: ${decimals}; Expected: ${expected}]`
    : "";
  it(`should ${testName} ${testParamsDisplay}`, () => {
    const tokenAmount = contractHelpers.decimalToTokenAmount(number, decimals);
    expect(tokenAmount.toString()).toBe(expected.toString());
  });
};

export const contractHelpersTests = (BigNumber: BigNumberConstructor<any>) => {
  const contractHelpers = new ContractHelpers(BigNumber);
  describe("decimal to token amount", () => {
    const tests = getDecimalToTokenTests(BigNumber);
    tests.nonFractional.forEach(({ number, decimals, expected }) => {
      runDecimalToTokenAmountTest(
        contractHelpers,
        "convert numbers without fractional portion",
        number,
        decimals,
        expected
      );
    });
    tests.fractional.forEach(({ number, decimals, expected }) => {
      runDecimalToTokenAmountTest(
        contractHelpers,
        "convert numbers with fractional portions",
        number,
        decimals,
        expected
      );
    });
  });

  //   describe("token to decimal amount", () => {});

  //   describe("contract decimal to token amount", () => {});

  //   describe("contract token to decimal amount", () => {});
};
