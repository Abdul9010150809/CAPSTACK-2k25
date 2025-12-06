import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
// TODO: Import user model functions

export const verify = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization as string | undefined;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Invalid token format' });

    const decoded = jwt.verify(token, config.jwtSecret);
    return res.json({ valid: true, payload: decoded });
  } catch (err: any) {
    return res.status(401).json({ valid: false, error: err.message || 'Unauthorized' });
  }
};

export const login = async (req: Request, res: Response) => {
  // TODO: Implement login logic
  const { email, password } = req.body;
  // Dummy check
  if (email && password) {
    const userId = 1;
    const name = (req.body.name as string) || 'User';
    // Sign token with user info and expiry so frontend can validate `exp`
    const token = jwt.sign({ userId, email, name }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: userId.toString(), email, name } });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
};

export const register = async (req: Request, res: Response) => {
  // TODO: Implement registration
  const { email, password, name } = req.body;
  // Dummy response
  res.json({ message: 'User registered', userId: 1 });
};