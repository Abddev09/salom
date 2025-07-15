import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';

const usersService = new UsersService();

export const createUser = async (req: Request, res: Response) => {
  const result = await usersService.create(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

export const findAllUsers = async (req: Request, res: Response) => {
  const result = await usersService.findAll();
  res.json(result);
};

export const findUserById = async (req: Request, res: Response) => {
  const result = await usersService.findOne(+req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

export const updateUser = async (req: Request, res: Response) => {
  const result = await usersService.update(+req.params.id, req.body);
  res.status(result.success ? 200 : 404).json(result);
};

export const deleteUser = async (req: Request, res: Response) => {
  const result = await usersService.delete(+req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};
