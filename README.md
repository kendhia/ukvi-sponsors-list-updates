# Scheduled AWS Lambda with Pulumi

## Project Overview

This project demonstrates the use of Pulumi for infrastructure as code (IaC) in AWS. It features an AWS Lambda function that is triggered daily by an EventRule. The Lambda function's primary task is to download the current list of sponsor companies from the UK government website, compare it with a previously stored list in an Amazon S3 bucket, and then send the comparison results to an email account via an Amazon SNS topic. Finally, the Lambda updates the S3 bucket with the latest list of companies for the next day's comparison.

## Purpose

The purpose of this project is to provide a practical example of how Pulumi can be used to manage and deploy AWS resources in a serverless architecture. It showcases:

- Automation of daily tasks using AWS Lambda.
- Use of AWS EventBridge (formerly CloudWatch Events) for scheduling Lambda executions.
- Interaction between AWS Lambda and S3 for data storage and retrieval.
- Utilization of SNS for sending email notifications.
- Implementation of Pulumi for infrastructure management.

## How it Works

1. **Daily Trigger**: An AWS EventRule triggers the Lambda function once every day.
2. **Data Retrieval**: The Lambda function downloads the latest list of sponsor companies from the UK government website.
3. **Data Comparison**: It compares this list with the one stored from the previous day in an S3 bucket.
4. **Notification**: The results of the comparison are sent to a specified email address through an SNS topic.
5. **Data Update**: The S3 bucket is updated with the latest list for use in the next day's comparison.

## Prerequisites

Before deploying this project, ensure you have the following:

- An AWS account with appropriate permissions to create Lambda functions, S3 buckets, SNS topics, and EventBridge rules.
- Pulumi CLI installed and configured for AWS.
- Node.js and yarn.

## Deployment

1. **Clone the Repository**:
   ```bash
   git clone [URL of the repository]
   cd [repository name]
   ```

2. **Install Dependencies** (if applicable):
   ```bash
   yarn
   ```

3. **Configure AWS Credentials**:
   Ensure your AWS credentials are configured correctly, either by specifying the correct profile in `Pulumi.dev.yaml`, by setting environment variables (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`), or by configuring the AWS CLI.

4. **Deploy with Pulumi**:
   ```bash
   yarn deploy
   ```

5. **Verify Deployment**:
   Check the AWS Management Console to ensure that the resources have been deployed correctly.

## Usage

Once deployed, the system will automatically perform its tasks daily. You can monitor the Lambda's execution and outputs through AWS CloudWatch logs. To receive notifications, ensure that you subscribe to the SNS topic with your email address.

You can also run a test event on the lambda, and you should receive a notification on your pre-configured email.

## Customization

You can customize the Lambda's functionality by modifying the code in the `src/index.ts` file (or the other utils in `src`). The Pulumi scripts can be adjusted to change the AWS resource configurations.

## Contributing

Contributions to this project are welcome. Please follow standard GitHub pull request procedures to submit your changes.

## License

This project is licensed under the [MIT License](LICENSE).
