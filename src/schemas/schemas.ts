import { newCardSchema, activateCardSchema, rechargeCardSchema, blockCardSchema } from './cards.js';
import { physicalPurchaseSchema, onlinePurchaseSchema } from './buisiness.js';

const schemas = {
    newCardSchema,
    activateCardSchema,
    rechargeCardSchema,
    blockCardSchema,
    physicalPurchaseSchema,
    onlinePurchaseSchema,
};

export default schemas;
