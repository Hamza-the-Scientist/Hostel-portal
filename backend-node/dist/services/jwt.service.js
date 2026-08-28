"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const generateJwtToken = (user) => {
    const payload = {
        sub: user.userId.toString(),
        userId: user.userId,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
    };
    return jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secret, {
        issuer: jwt_1.jwtConfig.issuer,
        audience: jwt_1.jwtConfig.audience,
        expiresIn: `${jwt_1.jwtConfig.expiryMinutes}m`,
    });
};
exports.generateJwtToken = generateJwtToken;
//# sourceMappingURL=jwt.service.js.map