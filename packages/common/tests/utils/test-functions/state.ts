import {
  IAllowance,
  IStatefulAllowance,
  IStatefulBalance,
} from "../../../types/token-standards";
import { MOCK_ADDRESS } from "../constants";
import { IMintable } from "../types";

export type StateTestValues = {
  balance: number;
  required: number;
  expectedState: string;
};

export type TokenStateTestValues = StateTestValues & { allowance: number };

export type StateNames = { sufficient: string; insufficient: string };

export const amountStateTests = (
  testFn: (values: StateTestValues) => void,
  stateNames: StateNames
) => {
  const values: StateTestValues[] = [
    { balance: 0, required: 1000, expectedState: stateNames.insufficient },
    { balance: 1000, required: 999, expectedState: stateNames.sufficient },
    { balance: 999, required: 1000, expectedState: stateNames.insufficient },
    { balance: 1000, required: 0, expectedState: stateNames.sufficient },
    { balance: 0, required: 0, expectedState: stateNames.sufficient },
    { balance: 1000, required: 1000, expectedState: stateNames.sufficient },
  ];
  values.forEach((v) => testFn(v));
};

export const tokenStateTests = (
  testFn: (values: TokenStateTestValues) => void,
  stateNames: {
    insufficientBalance: string;
    insufficientAllowance: string;
    sufficientTokens: string;
  }
) => {
  const values: TokenStateTestValues[] = [
    {
      balance: 0,
      allowance: 0,
      required: 1000,
      expectedState: stateNames.insufficientBalance,
    },
    {
      balance: 1000,
      allowance: 0,
      required: 999,
      expectedState: stateNames.insufficientAllowance,
    },
    {
      balance: 999,
      allowance: 998,
      required: 999,
      expectedState: stateNames.insufficientAllowance,
    },
    {
      balance: 0,
      allowance: 1000,
      required: 999,
      expectedState: stateNames.insufficientBalance,
    },

    {
      balance: 999,
      allowance: 999,
      required: 1000,
      expectedState: stateNames.insufficientBalance,
    },
    {
      balance: 1000,
      allowance: 0,
      required: 0,
      expectedState: stateNames.sufficientTokens,
    },
    {
      balance: 0,
      allowance: 1000,
      required: 0,
      expectedState: stateNames.sufficientTokens,
    },

    {
      balance: 0,
      allowance: 0,
      required: 0,
      expectedState: stateNames.sufficientTokens,
    },
    {
      balance: 1000,
      allowance: 1000,
      required: 1000,
      expectedState: stateNames.sufficientTokens,
    },
  ];
  values.forEach((v) => testFn(v));
};

export const allowanceStateTests = (
  allowanceSetter: IAllowance<any>,
  allowanceState: IStatefulAllowance<any>,
  stateNames: StateNames
) => {
  const testFn = (values: StateTestValues) => {
    it(`should return the ${values.expectedState} state`, async () => {
      await allowanceSetter.approve(MOCK_ADDRESS, values.balance);
      const state = await allowanceState.getAllowanceState(
        values.required,
        MOCK_ADDRESS
      );
      if (state.isError) {
        throw new Error(state.data.message);
      }
      expect(state.data.state).toBe(values.expectedState);
    });
  };
  amountStateTests(testFn, stateNames);
};

export const balanceStateTests = (
  balanceSetter: IMintable,
  balanceState: IStatefulBalance<any>,
  stateNames: StateNames
) => {
  const testFn = (values: StateTestValues) => {
    it(`should return the ${values.expectedState} state`, async () => {
      await balanceSetter.burnAll();
      await balanceSetter.mint(values.balance);
      const state = await balanceState.getBalanceState(values.required);
      if (state.isError) {
        throw new Error(state.data.message);
      }
      expect(state.data.state).toBe(values.expectedState);
    });
  };
  amountStateTests(testFn, stateNames);
};
