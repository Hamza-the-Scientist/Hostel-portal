"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'SindhDormitoryPortalSuperSecretKey2026ForFYPProject!',
    issuer: process.env.JWT_ISSUER || 'SindhDormitoryPortal',
    audience: process.env.JWT_AUDIENCE || 'SindhDormitoryPortal',
    expiryMinutes: parseInt(process.env.JWT_EXPIRY_MINUTES || '60', 10),
};
//# sourceMappingURL=jwt.js.map