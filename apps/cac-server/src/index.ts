import express from 'express';
import { PORT } from './utils/environments';
import { Test } from '@horus/shared-types';

const test: Test = {
  test: 'uhuh',
};
console.log(test);

const app = express();

app.listen(PORT, () => console.log(`CAC Server is running on port ${PORT}`));
