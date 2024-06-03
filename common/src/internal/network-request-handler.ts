import { NetworkResponse } from "../../types";

export class NetworkRequestHandler {
  static async send<T>(
    contractRequest: () => Promise<T>
  ): Promise<NetworkResponse<T>> {
    try {
      const res = await contractRequest();
      return { data: res, isError: false };
    } catch (e) {
      return { data: e as string, isError: true };
    }
  }
}

//Have handlers for response types (uints, etc...)
