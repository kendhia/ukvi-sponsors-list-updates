import * as AWS from "aws-sdk";

export async function getBucketContent({
  s3Client,
  bucketName,
  key,
}: {
  s3Client: AWS.S3;
  bucketName: string;
  key: string;
}) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const content = await s3Client.getObject(params).promise();
    return content.Body?.toString();
  } catch (error) {
    if (error.code === "NoSuchKey") {
      return null;
    }
    throw error;
  }
}

export function putBucketContent({
  s3Client,
  bucketName,
  key,
  content,
}: {
  s3Client: AWS.S3;
  bucketName: string;
  key: string;
  content: string;
}) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: content,
  };

  return s3Client.putObject(params).promise();
}

export function sendSNSMessage({
  snsClient,
  topicArn,
  message,
}: {
  snsClient: AWS.SNS;
  topicArn: string;
  message: string;
}) {
  const params = {
    TopicArn: topicArn,
    Message: message,
  };

  return snsClient.publish(params).promise();
}
