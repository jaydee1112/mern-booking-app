import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

//we call the code below declaration merging, to extend existing types or interfaces, including those from third-party libraries like Express. To add custom properties or methods to the Express request object, you can declare a module augmentation for Express.
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['auth_token'];
  if (!token) {
    return res.status(401).json({ message: 'unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'unauthorized' });
  }
};

export default verifyToken;
