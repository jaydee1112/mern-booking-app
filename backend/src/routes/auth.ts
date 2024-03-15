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

router.post('/logout', (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    expires: new Date(0),
  });
  res.send();
});
export default router;

/*This route handler is for handling a POST request to the '/logout' endpoint. It logs out a user by clearing the 'auth_token' cookie and sending an empty response.

Here's a breakdown of the code:

router.post('/logout', ...) - Defines a route handler for handling POST requests to the '/logout' endpoint.

(req: Request, res: Response) => { ... } - Arrow function that takes a request (req) and response (res) object as parameters.

res.cookie('auth_token', '', { expires: new Date(0) }) - Clears the 'auth_token' cookie by setting its value to an empty string and setting its expiration date to a past date (specifically, January 1, 1970, which is commonly used to expire cookies).

res.send() - Sends an empty response back to the client to indicate that the logout was successful.

This code snippet is typically used in an Express.js application to handle user logout functionality by clearing the authentication token cookie. */
