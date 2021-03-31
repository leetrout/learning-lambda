const util = require("util");

exports.handler = async (inputObj) => {
  console.info(inputObj);

  if (inputObj.fail) {
    throw new Error(`processing failed: ${util.inspect(inputObj)}`);
  }

  return {
    processed: true,
    s3cfg: inputObj.s3cfg,
    input: inputObj,
  };
};
