import {
  BigNumberish,
  BigNumberConstructor,
  IBigNumber,
} from "../../../../types/big-number";

export type TokenTest<E> = {
  number: BigNumberish<any>;
  decimals: number;
  expected: E;
};

const getNonFractionalTests = (
  BigNumber: BigNumberConstructor<any>,
  number: BigNumberish<any>,
  decimals: number
): TokenTest<IBigNumber<any>> => ({
  number,
  decimals,
  expected: new BigNumber(number)
    .mul(new BigNumber(10).pow(new BigNumber(decimals)))
    .toString(),
});

const getNonFractionalTest = (
  BigNumber: BigNumberConstructor<IBigNumber<any>>
) => getNonFractionalTests.bind(null, BigNumber);

const createFractionalNumberTest = (
  number: number,
  decimals: number
): TokenTest<number> => ({
  number,
  decimals,
  expected: Math.trunc(number * Math.pow(10, decimals)),
});

const nonFractionalNumbers = [
  [200000, 2],
  [3200, 3],
  [10, 3],
  [1, 0],
  [0, 0],
  [0, 15],
  [100, 18],
  [2500, 18],
  [2600, 17],
];

const fractionalNumbers = [
  [100.251111111111111111, 9],
  [100.251, 1],
  [100.25, 1],
  [10.23, 5],
];

const exactFractionalNumbers = [
  [100.2, 1],
  [100.29875, 5],
  [5.999, 3],
  [2.23, 2],
  [1679.123, 3],
  [0.123, 3],
];

type AnyBigNumberish = BigNumberish<IBigNumber<any>>;

type DecimalTokenTests = {
  nonFractional: TokenTest<AnyBigNumberish>[];
  fractional: TokenTest<AnyBigNumberish>[];
  exactFractional: TokenTest<AnyBigNumberish>[];
  edgeCases: TokenTest<AnyBigNumberish>[];
};

export const getDecimalToTokenTests = (
  BigNumber: BigNumberConstructor<any>
): DecimalTokenTests => {
  const createNonFractionalTest = getNonFractionalTest(
    BigNumber.bind(BigNumber)
  );
  return {
    nonFractional: nonFractionalNumbers.map(([num, dec]) =>
      createNonFractionalTest(num, dec)
    ),
    fractional: fractionalNumbers.map(([num, dec]) =>
      createFractionalNumberTest(num, dec)
    ),
    exactFractional: exactFractionalNumbers.map(([num, dec]) =>
      createFractionalNumberTest(num, dec)
    ),
    edgeCases: [
      { number: "", decimals: 0, expected: 0 },
      { number: "", decimals: 1, expected: 0 },
    ],
  };
};
