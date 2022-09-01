import bcrypt from 'bcrypt';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';

import * as businessRepository from '../repositories/businessRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';

import { unauthorizedError, notFoundError, forbiddenError } from '../middlewares/errorMiddleware.js';

export interface PhysicalPurchase {
    businessId: number;
    cardId: number;
    password: string;
    amount: number;
}

export interface OnlinePurchase {
    businessId: number;
    number: string;
    cardHolderName: string;
    securityCode: string;
    expirationDate: string;
    amount: number;
}

function sumTotalAmount(history: { amount: number }[]) {
    return history.reduce((prev: number, cur: { amount: number }) => prev + cur.amount, 0);
}

export async function makePhysicalPurchase(physicalPurchaseData: PhysicalPurchase) {
    const { businessId, cardId, password, amount } = physicalPurchaseData;

    const card = await cardRepository.findById(cardId);
    if (!card) {
        throw notFoundError('card');
    }

    if (!card.password) {
        throw forbiddenError('make purchases with an inactive card');
    }

    if (!dayjs().isBefore(dayjs(card.expirationDate, 'MM/YY'), 'month')) {
        throw forbiddenError('make purchases with an expired card');
    }

    if (card.isBlocked) {
        throw forbiddenError('make purchases with a blocked card');
    }

    if (!bcrypt.compareSync(password, card.password)) {
        throw unauthorizedError('purchase info');
    }

    const business = await businessRepository.findById(businessId);
    if (!business) {
        throw notFoundError('business');
    }

    if (business.type !== card.type) {
        throw unauthorizedError('card type');
    }

    const cardRechargeHistory = await rechargeRepository.findByCardId(cardId);
    const cardPurchaseHistory = await paymentRepository.findByCardId(cardId);

    const cardBalance = sumTotalAmount(cardRechargeHistory) - sumTotalAmount(cardPurchaseHistory);
    if (cardBalance - amount < 0) {
        throw forbiddenError('complete purchase due to insuficient money');
    }

    await paymentRepository.insert({ cardId, businessId, amount });
}

export async function makeOnlinePurchase(onlinePurchaseData: OnlinePurchase) {
    const { businessId, number, cardHolderName, securityCode, expirationDate, amount } = onlinePurchaseData;

    const card = await cardRepository.findByCardDetails(number, cardHolderName, expirationDate);
    if (!card) {
        throw notFoundError('card');
    }

    if (!card.password) {
        throw forbiddenError('make purchases with an inactive card');
    }

    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);

    if (securityCode !== cryptr.decrypt(card.securityCode)) {
        throw unauthorizedError('security code');
    }

    if (!dayjs().isBefore(dayjs(card.expirationDate, 'MM/YY'), 'month')) {
        throw forbiddenError('make purchases with an expired card');
    }

    if (card.isBlocked) {
        throw forbiddenError('make purchases with a blocked card');
    }

    const business = await businessRepository.findById(businessId);
    if (!business) {
        throw notFoundError('business');
    }

    if (business.type !== card.type) {
        throw unauthorizedError('card type');
    }

    const cardRechargeHistory = await rechargeRepository.findByCardId(card.id);
    const cardPurchaseHistory = await paymentRepository.findByCardId(card.id);

    const cardBalance = sumTotalAmount(cardRechargeHistory) - sumTotalAmount(cardPurchaseHistory);
    if (cardBalance - amount < 0) {
        throw forbiddenError('complete purchase due to insuficient money');
    }

    await paymentRepository.insert({ cardId: card.id, businessId, amount });
}
