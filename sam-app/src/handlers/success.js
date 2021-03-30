exports.handler = async (inputObj) => {
    console.info(inputObj);
  
    return {
      success: true,
      input: inputObj,
    };
  };
  