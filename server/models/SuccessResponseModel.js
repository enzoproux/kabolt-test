successResponse = (res, data, statusCode, message) => {
    res.status(statusCode || 200).json({
    code: statusCode || 200,
    message: message || "success",
    data: data || {}
  });
 };

 module.exports = successResponse;