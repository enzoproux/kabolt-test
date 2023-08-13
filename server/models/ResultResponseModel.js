successResponseModel = (res, data, statusCode, message) => {
    res.status(statusCode || 200).json({
    code: statusCode || 200,
    message: message || "success",
    results: data || {}
  });
 };

 errorResponseModel = (res, data, statusCode, message) => {
    res.status(statusCode || 500).json({
    code: statusCode || 500,
    message: message || "error",
    results: data || {}
  });
 };

 exports.ErrorResponseModel = errorResponseModel;
 exports.SuccessResponseModel = successResponseModel;