import { IBigNumber } from "../../big-number";
import { MappedStateData, StatefulResponse } from ".";

export type AllowanceStateMap<T extends IBigNumber<T>> = {
  "insufficient-allowance": T; //The difference between the required allowance and the user's allowance
  "sufficient-allowance": undefined;
};

export type AllowanceState<T extends IBigNumber<T>> =
  keyof AllowanceStateMap<T>;

export type AllowanceStateContext<T extends IBigNumber<T>> = MappedStateData<
  AllowanceStateMap<T>
>;

export type AllowanceStateResponse<T extends IBigNumber<T>> = StatefulResponse<
  AllowanceStateMap<T>
>;
