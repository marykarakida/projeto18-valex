import { Request, Response } from 'express';

import * as businessService from '../services/businessService.js';

export async function makePhysicalPurchase(req: Request, res: Response) {
    const { businessId } = req.params;
    const { cardId, password, amount } = req.body;

    await businessService.makePhysicalPurchase({ businessId: Number(businessId), cardId, password, amount });

    res.sendStatus(201);
}

export async function makeOnlinePurchase(req: Request, res: Response) {
    res.sendStatus(201);
}
