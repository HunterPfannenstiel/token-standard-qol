import { getSignedERC20 } from "./utils";
import { erc20Tests } from "../../../common/test/unit/erc20-tests";

describe("ERC20 Tests", () => {
  erc20Tests(getSignedERC20);
});
