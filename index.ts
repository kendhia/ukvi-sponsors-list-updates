import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const CSV_FILE_URL = config.require("CSV_FILE_URL");
const COMPANY_NAME = config.require("COMPANY_NAME");
const SEND_LIST_EMAIL = config.require("SEND_LIST_TO_EMAIL");

const lambdaRole = new aws.iam.Role("lambdaRole", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "lambda.amazonaws.com",
  }),
});

const companiesUpdatesListEmailing = new aws.sns.Topic(
  "companiesUpdatesListEmailing",
  {
    displayName: "Companies Updates Emailing topic",
  }
);

const emailSubscription = new aws.sns.TopicSubscription("emailSubscription", {
  endpoint: SEND_LIST_EMAIL,
  protocol: "email",
  topic: companiesUpdatesListEmailing,
});

const lambdaSNSAccessPolicy = new aws.iam.RolePolicyAttachment(
  "lambdaSNSAccessPolicy",
  {
    role: lambdaRole,
    policyArn: aws.iam.ManagedPolicy.AmazonSNSFullAccess,
  }
);

const lambdaExecutionRolePolicy = new aws.iam.RolePolicyAttachment(
  "lambdaRoleAttachment",
  {
    role: lambdaRole,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
  }
);

const lambdaS3AccessPolicy = new aws.iam.RolePolicyAttachment(
  "lambdaS3AccessPolicy",
  {
    role: lambdaRole,
    policyArn: aws.iam.ManagedPolicy.AmazonS3FullAccess,
  }
);

const s3Bucket = new aws.s3.Bucket("recent-sponsors-list");

const lambdaEnvVars = {
  variables: {
    BUCKET_NAME: s3Bucket.bucket,
    SNS_TOPIC_ARN: companiesUpdatesListEmailing.arn,
  } as {
    [key: string]: string | pulumi.Output<string>;
  },
};
CSV_FILE_URL && (lambdaEnvVars.variables["CSV_FILE_URL"] = CSV_FILE_URL);
COMPANY_NAME && (lambdaEnvVars.variables["COMPANY_NAME"] = COMPANY_NAME);

const lambda = new aws.lambda.Function("sponsors-list-update", {
  role: lambdaRole.arn,
  code: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("./dist"),
  }),
  handler: "index.handler",
  runtime: "nodejs18.x",
  environment: lambdaEnvVars,
  timeout: 60,
  memorySize: 512,
});

// run the lambda every day at 11:30 UTC
const rule = new aws.cloudwatch.EventRule("sponsors-list-update-rule", {
  scheduleExpression: "cron(30 11 * * ? *)",
});

const target = new aws.cloudwatch.EventTarget("sponsors-list-update-target", {
  rule: rule.name,
  arn: lambda.arn,
});

const permission = new aws.lambda.Permission(
  "sponsors-list-update-permission",
  {
    action: "lambda:InvokeFunction",
    function: lambda.name,
    principal: "events.amazonaws.com",
    sourceArn: rule.arn,
  }
);
