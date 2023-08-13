successResponseModel = (res, data, statusCode, message) => {
    res.status(statusCode || 200).json({
    code: statusCode || 200,
    message: message || "success",
    data: data || {}
  });
 };

 errorResponseModel = (res, data, statusCode, message) => {
    res.status(statusCode || 500).json({
    code: statusCode || 500,
    message: message || "error",
    data: data || {}
  });
 };

 exports.ErrorResponseModel = errorResponseModel;
 exports.SuccessResponseModel = successResponseModel;