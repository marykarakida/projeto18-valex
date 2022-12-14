import { Router } from 'express';

import validateSchema from '../middlewares/schemaMiddleware.js';
import * as businessController from '../controllers/businessController.js';

const router = Router();

router.post('/:businessId/purchase', validateSchema('physicalPurchaseSchema'), businessController.makePhysicalPurchase);

router.post('/:businessId/online-purchase', validateSchema('onlinePurchaseSchema'), businessController.makeOnlinePurchase);

export default router;
