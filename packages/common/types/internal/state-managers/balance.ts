import BN from "bn.js";
import { MappedStateData, StatefulResponse } from ".";

export type BalanceStateMap = {
  "insufficient-balance": BN;
  "sufficient-balance": undefined;
};

export type BalanceState = keyof BalanceStateMap;

export type BalanceStateContext = MappedStateData<BalanceStateMap>; //{state, data}

export type BalanceStateResponse = StatefulResponse<BalanceStateMap>; //{isError, data: {state, data}}
