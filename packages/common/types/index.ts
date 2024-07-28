import { MetaMaskInpageProvider } from "@metamask/providers";

//TODO: Change this to a better type
export type ABIDelegate = (contractAddress: string) => Promise<any>;

export type NetworkResponse<T, U = any> =
  | { isError: true; data: { error: U; message: string } }
  | { isError: false; data: T };

export type Provider = string | MetaMaskInpageProvider;
