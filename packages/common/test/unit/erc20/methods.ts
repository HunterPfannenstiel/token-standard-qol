import { ContractHelpers } from "../../../src/internal/contract-helpers";
import { ProviderContractConstructor } from "../../utils/types";
import {
  MOCK_ADDRESS,
  TEST_ERC20_1,
  TEST_ERC20_2,
  getGanacheContract,
} from "../../utils/constants";
import * as tERC20ABI from "../../utils/ABI/tERC20.json";
import { ERC20TestContractData, ITestableERC20 } from "../../utils/types";
import { amountTests } from "../../utils/test-functions/amounts";

export const erc20Tests = (
  contractConstructor: ProviderContractConstructor<ITestableERC20>
) => {
  const testERC20 = (contractData: ERC20TestContractData) => {
    let erc20: ITestableERC20;
    let signerAddress: string;
    beforeAll(async () => {
      const contractInfo = await getGanacheContract(
        contractConstructor,
        contractData.address,
        tERC20ABI.abi
      );
      erc20 = contractInfo.contract;
      signerAddress = contractInfo.signerAddress;
    });

    describe("Metadata methods", () => {
      describe("name method", () => {
        it("should return the correct name", async () => {
          const name = await erc20.name();
          expect(name).toBe(contractData.name);
        });
      });

      describe("decimals method", () => {
        it("should return the correct decimal number", async () => {
          const decimals = await erc20.decimals();
          expect(decimals).toBe(contractData.decimals);
        });
      });

      describe("symbol method", () => {
        it("should return the correct symbol", async () => {
          const symbol = await erc20.symbol();
          expect(symbol).toBe(contractData.symbol);
        });
      });
    });

    describe("Send methods", () => {
      describe("approve method", () => {
        const approveTest = (approveAmount: number) =>
          it(`should approve ${approveAmount} tokens`, async () => {
            await erc20.approve(MOCK_ADDRESS, approveAmount);
            const allowance = await erc20.allowance(
              signerAddress,
              MOCK_ADDRESS
            );
            const expectedAllowance = ContractHelpers.tokenToDecimalAmount(
              approveAmount,
              contractData.decimals
            );
            expect(allowance.toString()).toBe(expectedAllowance.toString());
          });
        amountTests(approveTest);
      });

      describe("balanceOf method", () => {
        beforeEach(async () => {
          await erc20.burnAll();
        });
        const balanceTest = (balanceAmount: number) => {
          it(`should have a balance of ${balanceAmount}`, async () => {
            await erc20.mint(balanceAmount);
            const balance = await erc20.balanceOf(signerAddress);
            const expectedBalance = ContractHelpers.tokenToDecimalAmount(
              balanceAmount,
              contractData.decimals
            );
            expect(balance.toString()).toBe(expectedBalance.toString());
          });
        };
        afterAll(async () => {
          await erc20.burnAll();
        });
        amountTests(balanceTest);
      });

      describe("totalSupply method", () => {
        beforeEach(async () => {
          await erc20.burnAll();
        });
        const supplyTest = (increasedSupply: number) => {
          it(`should have an increased supply of ${increasedSupply}`, async () => {
            const initialSupply = await erc20.totalSupply();
            await erc20.mint(increasedSupply);
            const newSupply = await erc20.totalSupply();
            const increaseSupplyDecimal = ContractHelpers.tokenToDecimalAmount(
              increasedSupply,
              contractData.decimals
            );

            const adjustedSupply = newSupply
              .sub(increaseSupplyDecimal)
              .toString();
            expect(adjustedSupply).toBe(initialSupply.toString());
          });
        };
        afterAll(async () => {
          await erc20.burnAll();
        });
        amountTests(supplyTest);
      });
    });

    describe("transfer method", () => {
      const transferTest = (transferAmount: number) => {
        it(`should transfer ${transferAmount} tokens`, async () => {
          const initialBalance = await erc20.balanceOf(signerAddress);
          await erc20.mint(transferAmount);
          await erc20.transfer(MOCK_ADDRESS, transferAmount);
          const newBalance = await erc20.balanceOf(signerAddress);
          expect(newBalance.toString()).toBe(initialBalance.toString());
        });
      };
      amountTests(transferTest);
    });

    describe("transferFrom method", () => {
      const transferFromTest = (transferAmount: number) => {
        it(`should transfer ${transferAmount} tokens`, async () => {
          const initialBalance = await erc20.balanceOf(signerAddress);
          await erc20.mint(transferAmount);
          await erc20.approve(signerAddress, transferAmount);
          await erc20.transferFrom(signerAddress, MOCK_ADDRESS, transferAmount);
          const newBalance = await erc20.balanceOf(signerAddress);
          expect(newBalance.toString()).toBe(initialBalance.toString());
        });
      };
      amountTests(transferFromTest);
    });
  };
  testERC20(TEST_ERC20_1);
  testERC20(TEST_ERC20_2);
};
