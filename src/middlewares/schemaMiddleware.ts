import { Request, Response, NextFunction } from 'express';

import { unprocessableEntityError } from './errorMiddleware.js';

import schemas from '../schemas/schemas.js';

function validateSchema(schema: string) {
    if (!Object.prototype.hasOwnProperty.call(schemas, schema)) {
        throw new Error(`'${schema}' schema does not exist`);
    }

    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schemas[schema].validate(req.body, { abortEarly: false });

        if (error) {
            throw unprocessableEntityError(error.details.map((detail: { message: string }) => detail.message));
        }

        next();
    };
}

export default validateSchema;
