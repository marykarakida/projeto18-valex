import { Router } from 'express';

import validateApiKey from '../middlewares/apiKeyMiddleware.js';
import validateSchema from '../middlewares/schemaMiddleware.js';
import createCard from '../controllers/cardController.js';

const router = Router();

router.post('/', validateApiKey, validateSchema('newCardSchema'), createCard);

export default router;
