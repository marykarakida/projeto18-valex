import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';

import router from './routes/router.js';
import errorHandler from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use(router);

app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
