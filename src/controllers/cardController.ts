import { Request, Response } from 'express';

import createNewCard from '../services/cardService.js';

export default async function createCard(req: Request, res: Response) {
    const { 'x-api-key': apiKey } = req.headers;
    const { employeeId, type } = req.body;

    await createNewCard(apiKey.toString(), employeeId, type);

    res.sendStatus(201);
}
