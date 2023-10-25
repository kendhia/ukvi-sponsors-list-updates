import * as AWS from "aws-sdk";
import { compareCompaniesList } from "./compareResults";
import {
  getBucketContent,
  putBucketContent,
  sendSNSMessage,
} from "./aws-utils";
import { isXCompanyAdded } from "./isXCompanyAdded";

const companiesListUrl = process.env.CSV_FILE_URL;
const bucketName = process.env.BUCKET_NAME;
const topicArn = process.env.SNS_TOPIC_ARN;

const s3Client = new AWS.S3({
  region: "eu-west-1",
});

const snsClient = new AWS.SNS({
  region: "eu-west-1",
});

export const handler = async () => {
  if (!companiesListUrl || !bucketName || !topicArn) {
    console.error("Missing environment variables", {
      companiesListUrl,
      bucketName,
      topicArn,
    });
    throw new Error("Missing environment variables");
  }

  const response = await fetch(companiesListUrl);
  const newCompaniesList = await response.text();

  console.log("Companies list downloaded");

  const oldCompaniesListText = await getBucketContent({
    s3Client,
    bucketName,
    key: "companies.csv",
  });

  if (!oldCompaniesListText) {
    throw new Error("Old companies list not found");
  }
  console.log("Old companies list loaded");

  const { addedCompanies, removedCompanies } = compareCompaniesList(
    oldCompaniesListText,
    newCompaniesList
  );
  const comparisonResult = JSON.stringify({
    expendAdded: isXCompanyAdded("expend", addedCompanies),
    numberOfAddedCompanies: addedCompanies.length,
    numberOfRemovedCompanies: removedCompanies.length,
    removedCompanies,
    addedCompanies,
  });
  console.log(`Companies list compared. Result: ${comparisonResult}`);

  await putBucketContent({
    s3Client,
    bucketName,
    key: "companies.csv",
    content: newCompaniesList,
  });
  console.log("Companies list uploaded to S3");

  console.log("Sending email");
  await sendSNSMessage({
    snsClient,
    topicArn,
    message: comparisonResult,
  });
  console.log("Email sent");

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Companies list updated",
    }),
  };
};
