import { Response } from 'express';

function errorHandler(err, _req, res: Response, _next) {
    res.sendStatus(500);
}

export default errorHandler;
