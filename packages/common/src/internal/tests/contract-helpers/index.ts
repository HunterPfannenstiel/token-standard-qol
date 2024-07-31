import {
  BigNumberConstructor,
  BigNumberish,
} from "../../../../types/big-number";
import { ContractHelpers } from "../../contract-helpers";
import { getDecimalToTokenTests, TokenTest } from "./utils";

const runDecimalToTokenAmountTest = (
  contractHelpers: ContractHelpers<any>,
  testName: string,
  { number, decimals, expected }: TokenTest<any>,
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

const runTokenToDecimalAmountTest = (
  contractHelpers: ContractHelpers<any>,
  testName: string,
  { number, decimals, expected }: TokenTest<any>,
  showTestParams = false
) => {
  const testParamsDisplay = showTestParams
    ? `[Number: ${expected}; Decimals: ${decimals}; Expected: ${number}]`
    : "";
  it(`should ${testName} ${testParamsDisplay}`, () => {
    const tokenAmount = contractHelpers.tokenToDecimalAmount(
      expected,
      decimals
    );
    expect(tokenAmount.toString()).toBe(number.toString());
  });
};

export const contractHelpersTests = (BigNumber: BigNumberConstructor<any>) => {
  const contractHelpers = new ContractHelpers(BigNumber);
  const conversionTests = getDecimalToTokenTests(BigNumber);
  describe("decimal to token amount", () => {
    conversionTests.nonFractional.forEach((test) => {
      runDecimalToTokenAmountTest(
        contractHelpers,
        "convert numbers without fractional portion",
        test
      );
    });
    conversionTests.fractional.forEach((test) => {
      runDecimalToTokenAmountTest(
        contractHelpers,
        "convert numbers with fractional portions",
        test
      );
    });
    conversionTests.exactFractional.forEach((test) => {
      runDecimalToTokenAmountTest(
        contractHelpers,
        "convert numbers with fractional portions",
        test
      );
    });
    conversionTests.edgeCases.forEach((test) =>
      runDecimalToTokenAmountTest(contractHelpers, "edge case", test)
    );
  });

  describe("token to decimal amount", () => {
    conversionTests.nonFractional.forEach((test) => {
      runTokenToDecimalAmountTest(
        contractHelpers,
        "convert numbers without fractional portion",
        test
      );
    });
    conversionTests.exactFractional.forEach((test) => {
      runTokenToDecimalAmountTest(
        contractHelpers,
        "convert numbers with fractional portions",
        test
      );
    });
  });

  //   describe("token to decimal amount", () => {});

  //   describe("contract decimal to token amount", () => {});

  //   describe("contract token to decimal amount", () => {});
};
