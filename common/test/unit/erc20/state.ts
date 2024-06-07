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
import { NetworkResponse } from "../../../types";

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
            throw new Error(state.data.message);
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
            throw new Error(state.data.message);
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
            throw new Error(state.data.message);
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
      expectError(() => errorERC20.allowance(signerAddress, MOCK_ADDRESS));
    });
    describe("approve", () => {
      expectError(() => errorERC20.allowance(signerAddress, MOCK_ADDRESS));
    });

    describe("balanceOf", () => {
      expectError(() => errorERC20.balanceOf(signerAddress));
    });

    describe("decimals", () => {
      expectError(() => errorERC20.decimals());
    });

    describe("name", () => {
      expectError(() => errorERC20.name());
    });

    describe("symbol", () => {
      expectError(() => errorERC20.symbol());
    });

    describe("totalSupply", () => {
      expectError(() => errorERC20.totalSupply());
    });

    describe("transfer", () => {
      expectError(() => errorERC20.transfer(MOCK_ADDRESS, 100));

      //Error within the smart contract function (invalid balance)
      expectError(async () => {
        await testERC20.burnAll();
        const res = await statefulERC20.transfer(MOCK_ADDRESS, 100);
        return res;
      });
    });

    describe("transferFrom", () => {
      expectError(() =>
        errorERC20.transferFrom(signerAddress, MOCK_ADDRESS, 100)
      );

      //Error within the smart contract function (invalid balance)
      expectError(async () => {
        await testERC20.burnAll();
        await statefulERC20.approve(signerAddress, 100);
        const res = await statefulERC20.transferFrom(
          signerAddress,
          MOCK_ADDRESS,
          100
        );
        await statefulERC20.approve(signerAddress, 0);
        return res;
      }, true);

      //Error within the smart contract function (invalid allowance)
      expectError(async () => {
        await testERC20.burnAll();
        const res = await statefulERC20.transferFrom(
          signerAddress,
          MOCK_ADDRESS,
          100
        );
        return res;
      }, true);
    });

    describe("getAllowanceState", () => {
      expectError(() => errorERC20.getAllowanceState(100, MOCK_ADDRESS));
    });

    describe("getBalanceState", () => {
      expectError(() => errorERC20.getBalanceState(100));
    });

    describe("getTokenState", () => {
      expectError(() => errorERC20.getTokenState(100, MOCK_ADDRESS));
    });
  });
};

const expectError = (
  action: () => Promise<NetworkResponse<any>>,
  logError = false
) =>
  it("should give an error", async () => {
    const res = await action();
    expect(res.isError).toBe(true);
    if (logError) console.log(res.data);
  });
