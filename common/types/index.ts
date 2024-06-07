//TODO: Change this to a better type
export type ABIDelegate = (contractAddress: string) => Promise<any>;

export type NetworkResponse<U> =
  | { isError: true; data: { error: any; message: string } }
  | { isError: false; data: U };

export type StateDataMap = Record<string, any>;

type StateData<T, U> = {
  state: T;
  data: U;
};

export type MappedStateData<M extends StateDataMap> = {
  [K in keyof M]: StateData<K, M[K]>;
}[keyof M];

export type StatefulResponse<M extends StateDataMap> = NetworkResponse<
  MappedStateData<M>
>;

export type StateManagerResponse = {};

export type URLProviderConstructor<T> = (url: string) => T;
