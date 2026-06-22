import express from 'express';
import { PORT } from './utils/environments';

const app = express();

app.listen(PORT, () => console.log(`Demand And Directives Server is running on port ${PORT}`));
