const { S3 } = require("@aws-sdk/client-s3");
const util = require("util");

function generateRandomString(len) {
  let n = len;
  if (!n) {
    n = 10;
  }

  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < n; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// https://stackoverflow.com/questions/10623798/how-do-i-read-the-contents-of-a-node-js-stream-into-a-string-variable
function streamToString (stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}

exports.handler = async (inputObj) => {
  const LM_S3_BUCKET = process.env.LM_S3_BUCKET;
  if (!LM_S3_BUCKET) {
    throw new Error(`bucket is not defined: ${util.inspect(process.env)}`);
  }

  const s3Client = new S3();
  const rawInput = await s3Client.getObject({
    Bucket: LM_S3_BUCKET,
    Key: inputObj.s3cfg.input,
  });

  const body = await streamToString(rawInput.Body)
  const input = JSON.parse(body);

  console.log("got object")
  console.log(util.inspect(input))

  const fail = !!input.shouldFail;

  return {
    fail,
    someString: generateRandomString(),
    s3cfg: inputObj.s3cfg,
    ...input
  };
};
