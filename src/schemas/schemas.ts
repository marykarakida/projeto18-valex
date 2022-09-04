import { newCardSchema, activateCardSchema, rechargeCardSchema } from './cards.js';
import { physicalPurchaseSchema, onlinePurchaseSchema } from './buisiness.js';

const schemas = { newCardSchema, activateCardSchema, rechargeCardSchema, physicalPurchaseSchema, onlinePurchaseSchema };

export default schemas;
