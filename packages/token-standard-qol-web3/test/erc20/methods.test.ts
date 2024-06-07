import { getSignedERC20Contracts } from "../utils";
import { erc20Tests } from "../../../common/test/unit/erc20/methods";

describe("ERC20 Tests", () => {
  erc20Tests(async (address, chainId, abi, providerURL) => {
    const { testable } = await getSignedERC20Contracts(
      address,
      chainId,
      abi,
      providerURL
    );
    return testable;
  });
});
