import { auth } from '@zayad/middlewares';
import express from 'express';
import { getConflictsController } from '../controllers/conflicts.controller';
const router = express.Router();

router.get('/:id', auth, getConflictsController);
router.get('/', auth, getConflictsController);

export default router;
