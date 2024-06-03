export const amountTests = (testFn: (amount: number) => any) => {
  const amounts = [10, 0, 15, 21.2, 10000.00005];
  amounts.forEach((a) => testFn(a));
};
