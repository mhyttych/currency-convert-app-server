const errorHandler = (error, req, res, next) => {  
  res.status(error.status || 500);
  res.json({
    error: {
      succes: false,
      message: error.message || "Server Error"
    }
  })
};

module.exports = errorHandler;
