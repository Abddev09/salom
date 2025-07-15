import express from 'express';
import { login, register } from '../controllers/login.controller';

const router = express.Router();

router.post('/register', register);
router.post('/', login);

export default router;
