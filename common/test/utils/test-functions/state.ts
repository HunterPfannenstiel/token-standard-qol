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
  sufficient: boolean;
};

export const amountStateTests = (testFn: (values: StateTestValues) => void) => {
  const values: StateTestValues[] = [
    { balance: 0, required: 1000, sufficient: false },
    { balance: 1000, required: 999, sufficient: true },
    { balance: 999, required: 1000, sufficient: false },
    { balance: 1000, required: 0, sufficient: true },
    { balance: 0, required: 0, sufficient: true },
    { balance: 1000, required: 1000, sufficient: true },
  ];
  values.forEach((v) => testFn(v));
};

const allowanceSufficientMap = {
  true: "sufficient-allowance",
  false: "insufficient-allowance",
};

export const allowanceStateTests = (
  allowanceSetter: IAllowance,
  allowanceState: IStatefulAllowance
) => {
  const testFn = (values: StateTestValues) => {
    it(`should be ${values.sufficient} that the state is sufficient`, async () => {
      await allowanceSetter.approve(MOCK_ADDRESS, values.balance);
      const state = await allowanceState.getAllowanceState(
        values.required,
        MOCK_ADDRESS
      );
      if (state.isError) {
        throw new Error(state.data);
      }
      const expectedState = allowanceSufficientMap[`${values.sufficient}`];
      expect(state.data.state).toBe(expectedState);
    });
  };
  amountStateTests(testFn);
};

const balanceSufficientMap = {
  true: "sufficient-balance",
  false: "insufficient-balance",
};

export const balanceStateTests = (
  balanceSetter: IMintable,
  balanceState: IStatefulBalance
) => {
  const testFn = (values: StateTestValues) => {
    it(`should be ${values.sufficient} that the state is sufficient`, async () => {
      await balanceSetter.burnAll();
      await balanceSetter.mint(values.balance);
      const state = await balanceState.getBalanceState(values.required);
      if (state.isError) {
        throw new Error(state.data);
      }
      const expectedState = balanceSufficientMap[`${values.sufficient}`];
      expect(state.data.state).toBe(expectedState);
    });
  };
  amountStateTests(testFn);
};
