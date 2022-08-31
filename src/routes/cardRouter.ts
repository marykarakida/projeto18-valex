import { Router } from 'express';

import validateApiKey from '../middlewares/apiKeyMiddleware.js';
import validateSchema from '../middlewares/schemaMiddleware.js';
import * as cardController from '../controllers/cardController.js';

const router = Router();

router.post('/', validateApiKey, validateSchema('newCardSchema'), cardController.createCard);

router.post('/:cardId/activate', validateSchema('activateCardSchema'), cardController.activateCard);

export default router;
