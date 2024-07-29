import { erc20StateTests } from "../../../common/tests/unit/erc20/state";
import { getSignedERC20Contracts } from "../utils";

describe("ERC20 Stateful Tests", () => {
  erc20StateTests(async (address, chainId, abi, providerURL) => {
    const contracts = await getSignedERC20Contracts(
      address,
      chainId,
      abi,
      providerURL
    );
    return {
      contract: {
        test: contracts.testable.contract,
        erc20: contracts.erc20.contract,
      },
      signerAddress: contracts.testable.signerAddress,
    };
  });
});
