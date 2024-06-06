import { ITestableERC20, ProviderContractConstructor } from "../../utils/types";
import {
  MOCK_ADDRESS,
  TEST_ERC20_1,
  getGanacheContract,
} from "../../utils/constants";
import * as tERC20ABI from "../../utils/ABI/tERC20.json";
import { ERC20, IStatefulERC20 } from "../../../types/token-standards/IERC20";
import { StatefulERC20 } from "../../../src/api/token-classes/stateful-erc20";
import {
  StateTestValues,
  allowanceStateTests,
  amountStateTests,
  balanceStateTests,
} from "../../utils/test-functions/state";

export const erc20StateTests = (
  contractsConstructor: ProviderContractConstructor<{
    test: ITestableERC20;
    erc20: ERC20;
  }>
) => {
  let testERC20: ITestableERC20;
  let statefulERC20: IStatefulERC20;
  let signerAddress: string;
  beforeAll(async () => {
    const contractData = await getGanacheContract(
      contractsConstructor,
      TEST_ERC20_1.address,
      tERC20ABI.abi
    );

    testERC20 = contractData.contract.test;
    signerAddress = contractData.signerAddress;

    statefulERC20 = new StatefulERC20(contractData.contract.erc20);
  });

  describe("State methods", () => {
    describe("Balance state", () => {
      //Passing in parameters initialized by beforeAll will be undefined
      const balanceSufficientMap = {
        true: "sufficient-balance",
        false: "insufficient-balance",
      };
      const testFn = (values: StateTestValues) => {
        it(`should be ${values.sufficient} that the state is sufficient`, async () => {
          await testERC20.burnAll();
          await testERC20.mint(values.balance);
          const state = await statefulERC20.getBalanceState(values.required);
          if (state.isError) {
            throw new Error(state.data);
          }
          const expectedState = balanceSufficientMap[`${values.sufficient}`];
          expect(state.data.state).toBe(expectedState);
        });
      };
      amountStateTests(testFn);
    });
    describe("Allowance state", () => {
      allowanceStateTests(testERC20, statefulERC20);
    });
  });
};
