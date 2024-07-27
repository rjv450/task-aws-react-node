import { check, validationResult } from 'express-validator';

export const validateUser = [
  check('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters long'),
  
  check('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters long'),
  
  check('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(), // Optional: normalize email to prevent case sensitivity issues
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
