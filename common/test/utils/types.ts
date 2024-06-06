import { IERC20 } from "../../types/token-standards/IERC20";

export interface IMintable {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param amount Type: uint256, Indexed: false
   */
  mint(amount: number): Promise<void>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  burnAll(): Promise<void>;
}

export interface ITestableERC20 extends IMintable, IERC20 {}

export type ERC20Metadata = {
  name: string;
  symbol: string;
  decimals: number;
};

export type ERC20TestContractData = {
  address: string;
} & ERC20Metadata;

export type ProviderContractConstructor<T> = (
  address: string,
  chainId: number,
  abi: any,
  providerURL: string
) => Promise<{ contract: T; signerAddress: string }>;
