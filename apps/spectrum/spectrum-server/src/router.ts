import express, { Request, Response } from 'express';
import conflictsRouter from './conflicts/routes/conflicts.routes';
import { handleError } from '@zayad/helpers';

const router = express.Router();

router.use('/conflicts', conflictsRouter);

router.use((_: Request, res: Response) => handleError(res, new Error('Endpoint not found'), 404, 'ROUTER'))

export default router
