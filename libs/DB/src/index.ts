import '@zayad/helpers';
import { ORM } from './orm/models/ORM';
import { configClient } from './config/config-client';

export * from './schemas/auth/black-list.schema';
export * from './schemas/auth/unit-tree.schema';
export * from './schemas/spectrum/conflict.schema';

ORM.connect(configClient);
