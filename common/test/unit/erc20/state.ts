import { ITestableERC20, ProviderContractConstructor } from "../../utils/types";
import {
  GANACHE_CHAIN_ID,
  GANACHE_PROVIDER_URL,
  MOCK_ADDRESS,
  TEST_ERC20_1,
  getGanacheContract,
} from "../../utils/constants";
import * as tERC20ABI from "../../utils/ABI/tERC20.json";
import { ERC20, IStatefulERC20 } from "../../../types/token-standards/IERC20";
import { StatefulERC20 } from "../../../src/api/token-classes/stateful-erc20";
import {
  StateTestValues,
  TokenStateTestValues,
  amountStateTests,
  tokenStateTests,
} from "../../utils/test-functions/state";

export const erc20StateTests = (
  contractsConstructor: ProviderContractConstructor<{
    test: ITestableERC20;
    erc20: ERC20;
  }>
) => {
  let testERC20: ITestableERC20;
  let statefulERC20: IStatefulERC20;
  let errorERC20: IStatefulERC20;
  let signerAddress: string;
  beforeAll(async () => {
    const contractData = await getGanacheContract(
      contractsConstructor,
      TEST_ERC20_1.address,
      tERC20ABI.abi
    );

    const errorConctractData = await contractsConstructor(
      MOCK_ADDRESS,
      GANACHE_CHAIN_ID,
      tERC20ABI.abi,
      GANACHE_PROVIDER_URL
    );

    testERC20 = contractData.contract.test;
    signerAddress = contractData.signerAddress;

    errorERC20 = new StatefulERC20(errorConctractData.contract.erc20);

    statefulERC20 = new StatefulERC20(contractData.contract.erc20);
  });

  describe("State methods", () => {
    describe("Balance state", () => {
      //Passing in parameters initialized by beforeAll will be undefined
      const testFn = (values: StateTestValues) => {
        it(`should return the ${values.expectedState} state`, async () => {
          await testERC20.burnAll();
          await testERC20.mint(values.balance);
          const state = await statefulERC20.getBalanceState(values.required);
          if (state.isError) {
            throw new Error(state.data);
          }
          expect(state.data.state).toBe(values.expectedState);
        });
      };
      amountStateTests(testFn, {
        sufficient: "sufficient-balance",
        insufficient: "insufficient-balance",
      });
    });

    describe("Allowance state", () => {
      const testFn = (values: StateTestValues) => {
        it(`should return the ${values.expectedState} state`, async () => {
          await testERC20.approve(MOCK_ADDRESS, values.balance);
          const state = await statefulERC20.getAllowanceState(
            values.required,
            MOCK_ADDRESS
          );
          if (state.isError) {
            throw new Error(state.data);
          }
          expect(state.data.state).toBe(values.expectedState);
        });
      };
      amountStateTests(testFn, {
        sufficient: "sufficient-allowance",
        insufficient: "insufficient-allowance",
      });
    });
    describe("Token state", () => {
      const testFn = (values: TokenStateTestValues) => {
        it(`should return the ${values.expectedState} state`, async () => {
          await testERC20.burnAll();
          await testERC20.mint(values.balance);
          await testERC20.approve(MOCK_ADDRESS, values.allowance);
          const state = await statefulERC20.getTokenState(
            values.required,
            MOCK_ADDRESS
          );
          if (state.isError) {
            throw new Error(state.data);
          }
          expect(state.data.state).toBe(values.expectedState);
        });
      };
      tokenStateTests(testFn, {
        insufficientAllowance: "insufficient-allowance",
        insufficientBalance: "insufficient-balance",
        sufficientTokens: "sufficient",
      });
    });
  });

  describe("ERC20 methods", () => {
    describe("allowance", () => {
      it("should give an error", async () => {
        const res = await errorERC20.allowance(signerAddress, MOCK_ADDRESS);
        console.log(res);
        expect(res.isError).toBe(true);
      });
    });
  });
};
