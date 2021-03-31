const { SFNClient, StartExecutionCommand } = require("@aws-sdk/client-sfn");
const { S3 } = require("@aws-sdk/client-s3");
const util = require("util");

exports.handler = async (inputObj, ctx) => {
  const LM_S3_BUCKET = process.env.LM_S3_BUCKET;
  if (!LM_S3_BUCKET) {
    throw new Error(`bucket is not defined: ${util.inspect(process.env)}`);
  }

  const LM_STATE_MACHINE_ARN = process.env.LM_STATE_MACHINE_ARN;
  if (!LM_STATE_MACHINE_ARN) {
    throw new Error(
      `LM_STATE_MACHINE_ARN is not defined: ${util.inspect(process.env)}`
    );
  }
  // If you change this message, you will need to change hello-from-lambda.test.js
  const message = "Hello from Lambda!";

  // All log statements are written to CloudWatch
  console.info(util.inspect(process.env));
  console.info(util.inspect(ctx));
  console.info(util.inspect(inputObj));

  const name = `${inputObj.requestContext.requestId}.json`;
  const inputKey = `input/${name}`;
  const outputKey = `output/${name}`;
  const errorKey = `error/${name}`;

  // The input sent to the step function
  const stepFnInput = {
    s3cfg: {
      input: inputKey,
      output: outputKey,
      error: errorKey,
    },
  };

  // Store input in S3
  const s3Client = new S3();
  await s3Client.putObject({
    Bucket: LM_S3_BUCKET,
    Key: inputKey,
    Body: inputObj.body,
  });

  // Trigger the step function
  const sfClient = new SFNClient();
  const cmd = new StartExecutionCommand({
    stateMachineArn: LM_STATE_MACHINE_ARN,
    input: JSON.stringify(stepFnInput),
  });

  await sfClient.send(cmd);

  response = {
    statusCode: 200,
    body: JSON.stringify({
      msg: message,
      input: stepFnInput,
    }),
  };
  return response;
};
