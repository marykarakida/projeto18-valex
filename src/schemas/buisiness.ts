import Joi from 'joi';

const physicalPurchaseSchema = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string()
        .regex(/^[0-9]*$/)
        .length(4)
        .required()
        .messages({
            'string.pattern.base': '"password" must be a numeric string',
        }),
    amount: Joi.number().min(0).required(),
});

export default physicalPurchaseSchema;
