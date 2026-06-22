import express from 'express';
import { PORT } from './utils/environments';

const app = express();

app.listen(PORT, () => console.log(`UNIT SYMBOLS Server is running on port ${PORT}`));
