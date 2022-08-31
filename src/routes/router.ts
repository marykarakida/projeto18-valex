import { Router } from 'express';

import cardRouter from './cardRouter.js';

const router = Router();

router.use('/cards', cardRouter);

export default router;
