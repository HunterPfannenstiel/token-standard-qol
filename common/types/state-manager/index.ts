import { MappedStateData, StatefulResponse } from "..";
import BN from "bn.js";

type BalanceStateMap = {
  "insufficient-balance": BN;
  "sufficient-balance": undefined;
};

export type BalanceState = keyof BalanceStateMap;

export type BalanceStateContext = MappedStateData<BalanceStateMap>; //{state, data}

export type BalanceStateResponse = StatefulResponse<BalanceStateMap>; //{isError, data: {state, data}}

type AllowanceStateMap = {
  "insufficient-allowance": BN; //The difference between the required allowance and the user's allowance
  "sufficient-allowance": undefined;
};

export type AllowanceState = keyof AllowanceStateMap;

export type AllowanceStateContext = MappedStateData<AllowanceStateMap>;

export type AllowanceStateResponse = StatefulResponse<AllowanceStateMap>;

type TokenStateMap = {
  sufficient: undefined;
} & Pick<BalanceStateMap, "insufficient-balance"> &
  Pick<AllowanceStateMap, "insufficient-allowance">;

export type TokenState = keyof TokenStateMap;

export type TokenStateContext = MappedStateData<TokenStateMap>;

export type TokenStateResponse = StatefulResponse<TokenStateMap>;
