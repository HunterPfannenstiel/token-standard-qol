import { NetworkResponse } from "../..";

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
