import { Router } from 'express';
import { OperatorsController } from '../controllers/operators.controller';

const router = Router();

router.post('/', OperatorsController.create);
router.get('/', OperatorsController.findAll);
router.get('/:id', OperatorsController.findOne);
router.get('/users/:id', OperatorsController.getOperatorWithUsers);
router.patch('/:id', OperatorsController.update);
router.delete('/:id', OperatorsController.remove);

export default router;
