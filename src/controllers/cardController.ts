import { Request, Response } from 'express';

import * as cardService from '../services/cardService.js';
import { CardUpdateData as CardData } from '../repositories/cardRepository.js';

export async function createCard(req: Request, res: Response) {
    const { 'x-api-key': apiKey } = req.headers;
    const { employeeId, type }: CardData = req.body;

    await cardService.createCard(apiKey.toString(), employeeId, type);

    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { employeeId, password, securityCode }: CardData = req.body;

    await cardService.activateCard(Number(employeeId), Number(cardId), password, securityCode);

    res.sendStatus(200);
}
