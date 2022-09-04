import { Router } from 'express';

import cardRouter from './cardRouter.js';
import businessesRouter from './businessesRouter.js';

const router = Router();

router.use('/cards', cardRouter);
router.use('/businesses', businessesRouter);

export default router;
