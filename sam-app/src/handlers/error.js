const { S3 } = require("@aws-sdk/client-s3");

exports.handler = async (inputObj) => {
  const LM_S3_BUCKET = process.env.LM_S3_BUCKET;
  if (!LM_S3_BUCKET) {
    throw new Error(`bucket is not defined: ${util.inspect(process.env)}`);
  }

  const result = {
    success: false,
    error: true,
    input: inputObj,
  };

  const s3Client = new S3();
  await s3Client.putObject({
    Bucket: LM_S3_BUCKET,
    Key: inputObj.s3cfg.error,
    Body: JSON.stringify(result, null, "  "),
  })

  return result
};
