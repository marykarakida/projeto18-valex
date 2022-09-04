import Joi from 'joi';

export const physicalPurchaseSchema = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string()
        .trim()
        .regex(/^[0-9]*$/)
        .length(4)
        .required()
        .messages({
            'string.pattern.base': '"password" must be a numeric string',
        }),
    amount: Joi.number().min(1).required(),
});

export const onlinePurchaseSchema = Joi.object({
    number: Joi.string()
        .trim()
        .regex(/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/)
        .required()
        .messages({
            'string.pattern.base': '"number" must be a numeric string with #### #### #### #### pattern',
        }),
    cardHolderName: Joi.string().trim().required(),
    securityCode: Joi.string()
        .trim()
        .regex(/^[0-9]*$/)
        .length(3)
        .required()
        .messages({
            'string.pattern.base': '"securityCode" must be a numeric string',
        }),
    expirationDate: Joi.string()
        .trim()
        .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)
        .required()
        .messages({
            'string.pattern.base': '"expirationDate" must be a valida date with MM/YY pattern',
        }),
    amount: Joi.number().min(1).required(),
});
