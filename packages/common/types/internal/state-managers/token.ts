import { MappedStateData, StatefulResponse } from ".";
import { AllowanceStateMap } from "./allowance";
import { BalanceStateMap } from "./balance";
import { IBigNumber } from "../../big-number";

type TokenStateMap<T extends IBigNumber<T>> = {
  sufficient: undefined;
} & Pick<BalanceStateMap<T>, "insufficient-balance"> &
  Pick<AllowanceStateMap<T>, "insufficient-allowance">;

export type TokenState<T extends IBigNumber<T>> = keyof TokenStateMap<T>;

export type TokenStateContext<T extends IBigNumber<T>> = MappedStateData<
  TokenStateMap<T>
>;

export type TokenStateResponse<T extends IBigNumber<T>> = StatefulResponse<
  TokenStateMap<T>
>;
