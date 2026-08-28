import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/student-login',
  [
    body('cnic').notEmpty().withMessage('CNIC is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  AuthController.studentLogin
);

router.post(
  '/admin-login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  AuthController.adminLogin
);

router.post(
  '/register',
  [
    body('cnic').notEmpty().withMessage('CNIC is required'),
    body('registrationNumber').notEmpty().withMessage('Registration Number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  AuthController.registerStudent
);

// Alias route for student registration
router.post('/student-register', AuthController.registerStudent);

export default router;
