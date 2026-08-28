"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized access. Token missing.' });
        return;
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.secret);
        // Support claims from .NET JWT generator or Node JWT generator
        const userId = decoded.sub || decoded.userId || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        const role = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const email = decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
        if (!userId) {
            res.status(401).json({ message: 'Invalid token structure.' });
            return;
        }
        req.user = {
            userId: parseInt(userId, 10),
            email: email || '',
            role: role || '',
            firstName: decoded.firstName || decoded.FirstName || '',
            lastName: decoded.lastName || decoded.LastName || '',
        };
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token.' });
        return;
    }
};
exports.authenticateJWT = authenticateJWT;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required.' });
            return;
        }
        const userRole = req.user.role;
        // Standardize role names for comparison
        const normalizedUserRole = userRole.toLowerCase();
        const allowed = roles.map(r => r.toLowerCase());
        if (!allowed.includes(normalizedUserRole)) {
            res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map