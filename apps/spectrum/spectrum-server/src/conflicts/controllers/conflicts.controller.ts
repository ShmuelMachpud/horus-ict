import { RequestWithUser } from '@zayad/types';
import { Response } from 'express';
import { getConflictsService } from '../service/conflicts.service';
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
