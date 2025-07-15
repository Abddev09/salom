// src/controllers/operators.controller.ts
import { Request, Response } from 'express';
import { OperatorService } from '../services/operators.service';

const operatorService = new OperatorService();

export const OperatorsController = {
  async create(req: Request, res: Response) {
    const { name } = req.body;
    const result = await operatorService.create(name);
    res.status(201).json(result);
  },

  async findAll(_req: Request, res: Response) {
    const result = await operatorService.findAll();
    res.json(result);
  },

  async findOne(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const result = await operatorService.findById(id);
    res.json(result);
  },

  async getOperatorWithUsers(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const result = await operatorService.findById(id);
    res.json(result);
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const result = await operatorService.update(id, req.body);
    res.json(result);
  },

  async remove(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const result = await operatorService.delete(id);
    res.json(result);
  },
};
