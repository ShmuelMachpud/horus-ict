import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const PORT = process.env.SERVICE_PORT;

app.listen(PORT, () => console.log(`auth-service is running on port ${PORT}`));
