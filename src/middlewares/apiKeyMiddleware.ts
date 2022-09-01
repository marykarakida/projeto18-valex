import { Request, Response, NextFunction } from 'express';

import { missingHeaderError } from './errorMiddleware.js';

function validateApiKey(req: Request, res: Response, next: NextFunction) {
    const { 'x-api-key': apiKey } = req.headers;

    if (typeof apiKey !== 'string' || !apiKey) throw missingHeaderError('x-api-key');

    next();
}

export default validateApiKey;
