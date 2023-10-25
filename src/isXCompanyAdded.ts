import { Company } from "./compareResults";

export function isXCompanyAdded(companyName: string, addedCompanies: Company[]) {
  return addedCompanies
    .map((company) => company["Organisation Name"]?.toLowerCase())
    .some((company) => company.includes(companyName));
}
