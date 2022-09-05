import { Request, Response } from 'express';

import * as cardService from '../services/cardService.js';
import * as rechargeService from '../services/rechargeService.js';
import { Card } from '../repositories/cardRepository.js';
import { Recharge } from '../repositories/rechargeRepository.js';

export async function createCard(req: Request, res: Response) {
    const { 'x-api-key': apiKey } = req.headers;
    const { employeeId, type }: Partial<Card> = req.body;

    const result = await cardService.createCard(apiKey.toString(), employeeId, type);

    res.status(201).send(result);
}

export async function getCardBalance(req: Request, res: Response) {
    const { cardId } = req.params;

    const result = await cardService.getCardBalance(Number(cardId));

    res.status(200).send(result);
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

export async function unblockCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { employeeId, password }: Partial<Card> = req.body;

    await cardService.unblockCard(Number(employeeId), Number(cardId), password);

    res.sendStatus(200);
}
