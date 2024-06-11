import { MetaMaskInpageProvider } from "@metamask/providers";

//TODO: Change this to a better type
export type ABIDelegate = (contractAddress: string) => Promise<any>;

export type NetworkResponse<U> =
  | { isError: true; data: { error: any; message: string } }
  | { isError: false; data: U };

export type Provider = string | MetaMaskInpageProvider;
