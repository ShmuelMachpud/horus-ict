import { RequestWithUser } from '@zayad/types';
import { Response } from 'express';
import {
  createConflictsService,
  deleteConflictsService,
  getConflictsService,
  updateConflictsService,
} from '../service/conflicts.service';
import { UUID } from 'crypto';
import { handleError } from '@zayad/helpers';

export const getConflictsController = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const { unit_id } = req.user!;
    const conflicts = await getConflictsService(unit_id, id as UUID);
    return res.send(conflicts);
  } catch (error) {
    return handleError(res, error);
  }
};
export const createConflictsController = async (req: RequestWithUser, res: Response) => {
  try {
    const { user, body } = req;
    const conflict = await createConflictsService(body, user!);
    return res.status(201).send(conflict);
  } catch (error) {
    return handleError(res, error);
  }
};
export const updateConflictsController = async (req: RequestWithUser, res: Response) => {
  try {
    const { user, body } = req;
    const { id } = req.params;
    const updated = await updateConflictsService(body, user!, id as UUID);
    return res.status(201).send(updated);
  } catch (error) {
    return handleError(res, error);
  }
};
export const deleteConflictsController = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const { unit_id } = req.user!;
    const deleted = await deleteConflictsService(unit_id, id as UUID);
    return res.send(deleted);
  } catch (error) {
    return handleError(res, error);
  }
};
