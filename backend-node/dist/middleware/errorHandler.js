"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({
        message: message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map