export interface IContractConstructor<T> {
  getContract(address: string, chainId: number): Promise<T>;
}
