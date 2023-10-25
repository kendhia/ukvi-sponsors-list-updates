import path from "path";
import * as fs from "fs";
import { compareCompaniesList } from "../src/compareResults";

describe("compareCompaniesList", function () {
  const csvFilePath = path.resolve(__dirname, "old.csv");
  const csvFilePath2 = path.resolve(__dirname, "new.csv");

  const oldFile = fs.readFileSync(csvFilePath, { encoding: "utf-8" });
  const newFile = fs.readFileSync(csvFilePath2, { encoding: "utf-8" });

  test("return expected added and removed companies", function () {
    const { addedCompanies, removedCompanies } = compareCompaniesList(
      oldFile,
      newFile
    );

    expect(addedCompanies.length).toBe(1);
    expect(addedCompanies[0]["Organisation Name"]).toBe(
      "*ABOUTCARE HASTINGS LTD"
    );

    expect(removedCompanies.length).toBe(1);
    expect(removedCompanies[0]["Organisation Name"]).toBe(
      " McMullan Shellfish"
    );
  });
});
