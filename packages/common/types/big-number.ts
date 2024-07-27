type BigNumberComputor<T extends IBigNumber<T>> = (bigNumber: T) => T;

export interface IBigNumber<T extends IBigNumber<T>> {
  pow: BigNumberComputor<T>;
  mul: BigNumberComputor<T>;
  sub: BigNumberComputor<T>;
  add: BigNumberComputor<T>;
  lten(number: number): boolean;
}

export type BigNumberish<T extends IBigNumber<T>> =
  | number
  | string
  | Array<number>
  | Uint8Array
  | T;

export type BigNumberConstructor<T extends IBigNumber<T>> = new (
  number: BigNumberish<T>
) => T;

export type BigNumberConst<T extends IBigNumber<T>> = (
  number: BigNumberish<T>
) => T;
