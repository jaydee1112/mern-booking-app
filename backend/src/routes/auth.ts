import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.post(
  '/login',
  [
    check('email', 'Email is required').isString(),
    check('password', 'Password is required').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
    }

    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        res.status(400).json({ message: 'Invalid Credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        res.status(400).json({ message: 'Invalid Credentials' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1d' }
      );

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
      });

      res.status(200).json({ userId: user.id });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something Went Wrong' });
    }
  }
);

router.get('/validate-token', verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});
export default router;
