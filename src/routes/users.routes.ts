import express from 'express';
import {
  createUser,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
} from '../controllers/users.controller';

const router = express.Router();

router.post('/', createUser);
router.get('/', findAllUsers);
router.get('/:id', findUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;