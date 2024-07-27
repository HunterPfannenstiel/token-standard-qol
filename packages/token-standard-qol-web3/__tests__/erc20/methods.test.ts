import { erc20Tests } from "../../../common/__test__/unit/erc20/methods";
import { getContractHelpers, getSignedERC20Contracts } from "../utils";
describe("ERC20 Tests", () => {
  erc20Tests(async (address, chainId, abi, providerURL) => {
    const { testable } = await getSignedERC20Contracts(
      address,
      chainId,
      abi,
      providerURL
    );
    return testable;
  }, getContractHelpers());
});
