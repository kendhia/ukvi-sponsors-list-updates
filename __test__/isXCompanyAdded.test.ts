import { isXCompanyAdded } from "../src/isXCompanyAdded";

describe("isXCompanyAdded", function () {
  test("return true if expend is in the list", function () {
    const result = isXCompanyAdded('expend', [
      {
        "Organisation Name": "Expend LTD",
        "Town/City": "London",
        County: "Greater London",
        "Type & Rating": "Restaurant - 5 Star",
        Route: "Route 1",
      },
    ]);

    expect(result).toBe(true);
  });
  test("return false if expend is not in the list", function () {
    const result = isXCompanyAdded('expend', [
      {
        "Organisation Name": "Another Company LTD",
        "Town/City": "London",
        County: "Greater London",
        "Type & Rating": "Restaurant - 5 Star",
        Route: "Route 1",
      },
    ]);

    expect(result).toBe(false);
  });
});
