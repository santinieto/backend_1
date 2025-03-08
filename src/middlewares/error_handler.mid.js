const errorHandler = (err, req, res, next) => {
    console.log(err);
    const message = err.message || "Internal server error";
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: message,
        method: req.method,
        url: req.url,
    });
};

export default errorHandler;
