const ErrorHandler = require("../utils/errorHandler");


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Wrong mongoDB Id error (Cast error)
    if (err.name === "CastError") {
        const message = `Resource not found . Invalid : ${err.path} `;
        err = new ErrorHandler(message, 404)
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400)
    }

    // Wrong JWT token
    if (err.code === "JsoneWebTokenError") {
        const message = `JSON web token is invalid. Try again`;
        err = new ErrorHandler(message, 400)
    }


    // JWT expire error
    if (err.code === "TokenExpiredError") {
        const message = `JSON web token is expired. Try again`;
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({ success: false, message: err.message });
    // err.stack  --> to see all the stacks 
}