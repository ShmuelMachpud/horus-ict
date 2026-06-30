import { Request } from 'express';

export type AuthDataType = {
  reality_id: string;
  reality_name: string;
  unit_id: string;
  unit_name: string;
  cell_id?: string;
  cell_name?: string;
  unit_type: string;
  role?: string;
  iat?: number;
  exp: number;
  upn: string;
  user_id: string;
};

export interface RequestWithUser extends Request {
  user?: AuthDataType;
}
