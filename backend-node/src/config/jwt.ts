import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'SindhDormitoryPortalSuperSecretKey2026ForFYPProject!',
  issuer: process.env.JWT_ISSUER || 'SindhDormitoryPortal',
  audience: process.env.JWT_AUDIENCE || 'SindhDormitoryPortal',
  expiryMinutes: parseInt(process.env.JWT_EXPIRY_MINUTES || '60', 10),
};
