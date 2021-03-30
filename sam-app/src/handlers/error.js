exports.handler = async (error) => {
  // If you change this message, you will need to change hello-from-lambda.test.js
  const message = "the error handler";

  // All log statements are written to CloudWatch
  console.info(`${message}`);
  console.error(error);

  return message;
};
