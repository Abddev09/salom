import { Request, Response } from 'express';
import { AuthService } from '../services/login.service';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const {username,password} = req.body
  const result = await authService.register(username, password) 
  res.json(result);
};

export const login = async (req: Request, res: Response) => {
  const {username,password} = req.body
  const result = await authService.login(username, password);
  res.json(result);
};
