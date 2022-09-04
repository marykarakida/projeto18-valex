import Joi from 'joi';

export const newCardSchema = Joi.object({
    employeeId: Joi.number().required(),
    type: Joi.string().trim().valid('groceries', 'restaurants', 'transport', 'education', 'health').required(),
});

export const activateCardSchema = Joi.object({
    employeeId: Joi.number().required(),
    password: Joi.string()
        .trim()
        .regex(/^[0-9]*$/)
        .length(4)
        .required()
        .messages({
            'string.pattern.base': '"password" must be a numeric string',
        }),
    securityCode: Joi.string()
        .trim()
        .regex(/^[0-9]*$/)
        .length(3)
        .required()
        .messages({
            'string.pattern.base': '"securityCode" must be a numeric string',
        }),
});

export const rechargeCardSchema = Joi.object({
    amount: Joi.number().min(1).required(),
});
