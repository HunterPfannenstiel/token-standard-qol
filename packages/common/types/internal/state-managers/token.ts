import { MappedStateData, StatefulResponse } from ".";
import { AllowanceStateMap } from "./allowance";
import { BalanceStateMap } from "./balance";

type TokenStateMap = {
  sufficient: undefined;
} & Pick<BalanceStateMap, "insufficient-balance"> &
  Pick<AllowanceStateMap, "insufficient-allowance">;

export type TokenState = keyof TokenStateMap;

export type TokenStateContext = MappedStateData<TokenStateMap>;

export type TokenStateResponse = StatefulResponse<TokenStateMap>;
