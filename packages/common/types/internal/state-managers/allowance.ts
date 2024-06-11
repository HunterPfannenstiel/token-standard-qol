import BN from "bn.js";
import { MappedStateData, StatefulResponse } from ".";

export type AllowanceStateMap = {
  "insufficient-allowance": BN; //The difference between the required allowance and the user's allowance
  "sufficient-allowance": undefined;
};

export type AllowanceState = keyof AllowanceStateMap;

export type AllowanceStateContext = MappedStateData<AllowanceStateMap>;

export type AllowanceStateResponse = StatefulResponse<AllowanceStateMap>;
