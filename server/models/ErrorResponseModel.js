errorResponse = (res, data, statusCode, message) => {
    res.status(statusCode || 500).json({
    code: statusCode || 500,
    message: message || "error",
    data: data || {}
  });
 };

 module.exports = errorResponse;