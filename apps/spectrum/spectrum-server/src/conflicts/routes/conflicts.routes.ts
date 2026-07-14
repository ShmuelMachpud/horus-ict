import express from 'express';
import {
  createConflictsController,
  deleteConflictsController,
  getConflictsController,
  updateConflictsController,
} from '../controllers/conflicts.controller';
import { auth } from '@zayad/middlewares';

const router = express.Router();

router.get('/:id', auth, getConflictsController);
router.get('/', auth, getConflictsController);
router.post('/', auth, createConflictsController);
router.patch('/:id', auth, updateConflictsController);
router.delete('/:id', auth, deleteConflictsController);
router.delete('/', auth, deleteConflictsController);

export default router;
