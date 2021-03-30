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

exports.handler = async (inputObj) => {
  let fail = !!inputObj.shouldFail;
  return {
    fail,
    someString: generateRandomString(),
  };
};
