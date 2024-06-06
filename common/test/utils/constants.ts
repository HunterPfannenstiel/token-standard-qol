import { ERC20TestContractData, ProviderContractConstructor } from "./types";

export const GANACHE_PROVIDER_URL = "HTTP://127.0.0.1:7545";
export const GANACHE_CHAIN_ID = 5777;
export const MOCK_ADDRESS = "0x648536a2961aEF3ec412E3e0E25427074f70f7Ff";

export const TEST_ERC20_1: ERC20TestContractData = {
  address: "0x648536a2961aEF3ec412E3e0E25427074f70f7Ff",
  decimals: 18,
  symbol: "t",
  name: "tERC20",
};

export const TEST_ERC20_2: ERC20TestContractData = {
  address: "0xB1094fDC4407392FB0fD6641adc06acCE99753eD",
  decimals: 2,
  symbol: "t",
  name: "tERC20",
};

export const getGanacheContract = <T>(
  contractConstructor: ProviderContractConstructor<T>,
  address: string,
  abi: any
) => {
  return contractConstructor(
    address,
    GANACHE_CHAIN_ID,
    abi,
    GANACHE_PROVIDER_URL
  );
};
