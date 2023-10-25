import { parse } from "csv/sync";

const headers = [
  "Organisation Name" as const,
  "Town/City" as const,
  "County" as const,
  "Type & Rating" as const,
  "Route" as const,
];

export type Company = Record<(typeof headers)[number], string>;

export function compareCompaniesList(
  oldCSV: string,
  newCSV: string
): {
  addedCompanies: Company[];
  removedCompanies: Company[];
} {
  const oldCsvParsed = parse(oldCSV, {
    delimiter: ",",
    columns: headers,
  }) as Company[];
  console.log("Old companies list parsed");

  const newCsvParsed = parse(newCSV, {
    delimiter: ",",
    columns: headers,
  }) as Company[];
  console.log("New companies list parsed");

  const oldCompaniesSet = new Set(
    oldCsvParsed.map((company) => company["Organisation Name"])
  );
  const newCompaniesSet = new Set(
    newCsvParsed.map((company) => company["Organisation Name"])
  );

  const addedCompanies = newCsvParsed.filter(
    (company) => !oldCompaniesSet.has(company["Organisation Name"])
  );
  const removedCompanies = oldCsvParsed.filter(
    (company) => !newCompaniesSet.has(company["Organisation Name"])
  );

  return { addedCompanies, removedCompanies };
}
