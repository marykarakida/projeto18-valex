import { Request, Response } from 'express';

import * as businessService from '../services/businessService.js';

export async function makePhysicalPurchase(req: Request, res: Response) {
    const { businessId } = req.params;
    const { cardId, password, amount } = req.body;

    await businessService.makePhysicalPurchase({ businessId: Number(businessId), cardId, password, amount });

    res.sendStatus(201);
}

export async function makeOnlinePurchase(req: Request, res: Response) {
    const { businessId } = req.params;
    const { number, cardHolderName, securityCode, expirationDate, amount } = req.body;

    await businessService.makeOnlinePurchase({
        businessId: Number(businessId),
        number,
        cardHolderName,
        securityCode,
        expirationDate,
        amount,
    });

    res.sendStatus(201);
}
