import { NetworkResponse } from "../../types";
import { NetworkRequestErrorHandler } from "../../types/internal/network-request-handler";

export class NetworkRequestHandler {
  constructor(private errorHandler?: NetworkRequestErrorHandler) {}

  static async send<T>(
    contractRequest: () => Promise<T>,
    errorHandler?: NetworkRequestErrorHandler
  ): Promise<NetworkResponse<T>> {
    try {
      const res = await contractRequest();
      return { data: res, isError: false };
    } catch (error: any) {
      let message = "An unknown error occurred";
      if (errorHandler) {
        message = errorHandler(error);
      } else if (error.toString) {
        message = error.toString();
      }
      return { data: { error, message }, isError: true };
    }
  }

  public async send<T>(contractRequest: () => Promise<T>) {
    return NetworkRequestHandler.send(contractRequest, this.errorHandler);
  }
}
