import { Request, Response } from 'express';

import * as cardService from '../services/cardService.js';
import * as rechargeService from '../services/rechargeService.js';
import { Card } from '../repositories/cardRepository.js';
import { Recharge } from '../repositories/rechargeRepository.js';

export async function createCard(req: Request, res: Response) {
    const { 'x-api-key': apiKey } = req.headers;
    const { employeeId, type }: Partial<Card> = req.body;

    await cardService.createCard(apiKey.toString(), employeeId, type);

    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { employeeId, password, securityCode }: Partial<Card> = req.body;

    await cardService.activateCard(Number(employeeId), Number(cardId), password, securityCode);

    res.sendStatus(200);
}

export async function rechargeCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { amount }: Partial<Recharge> = req.body;

    await rechargeService.rechargeCard(Number(cardId), amount);

    res.sendStatus(200);
}

export async function blockCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { employeeId, password }: Partial<Card> = req.body;

    await cardService.blockCard(Number(employeeId), Number(cardId), password);

    res.sendStatus(200);
}
