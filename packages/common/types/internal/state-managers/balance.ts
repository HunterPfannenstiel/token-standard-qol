import { MappedStateData, StatefulResponse } from ".";
import { IBigNumber } from "../../big-number";

export type BalanceStateMap<T extends IBigNumber<T>> = {
  "insufficient-balance": T;
  "sufficient-balance": undefined;
};

export type BalanceState<T extends IBigNumber<T>> = keyof BalanceStateMap<T>;

export type BalanceStateContext<T extends IBigNumber<T>> = MappedStateData<
  BalanceStateMap<T>
>; //{state, data}

export type BalanceStateResponse<T extends IBigNumber<T>> = StatefulResponse<
  BalanceStateMap<T>
>; //{isError, data: {state, data}}
