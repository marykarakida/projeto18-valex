import { Request, Response } from 'express';

import * as cardService from '../services/cardService.js';

export async function createCard(req: Request, res: Response) {
    const { 'x-api-key': apiKey } = req.headers;
    const { employeeId, type } = req.body;

    await cardService.createCard(apiKey.toString(), employeeId, type);

    res.sendStatus(201);
}
export async function activateCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { password, securityCode } = req.body;

    await cardService.activateCard(Number(cardId), password, securityCode);

    res.sendStatus(200);
}
