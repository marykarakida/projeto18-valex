import ensureBusinessExists from './businessService.js';
import * as cardService from './cardService.js';
import { Business } from '../repositories/businessRepository.js';
import { Card } from '../repositories/cardRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';

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

export async function getCardPaymentHistory(cardId: number) {
    const result = await paymentRepository.findByCardId(cardId);

    return result;
}

// BUSINESS RULES

export async function ensurePurchaseFulfillRequirements(card: Card, business: Business, amount: number) {
    cardService.ensureCardIsActive(card.password);
    cardService.ensureCardHasNotExpired(card.expirationDate);
    cardService.ensureCardIsUnblocked(card.isBlocked);
    cardService.ensureTypeIsSame(business.type, card.type);
    await cardService.ensureCardHasBalance(card.id, amount);
}

// CRUD OPERATIONS

export async function makePhysicalPurchase(physicalPurchaseData: PhysicalPurchase) {
    const { businessId, cardId, password, amount } = physicalPurchaseData;

    const business = await ensureBusinessExists(businessId);
    const card = await cardService.ensureCardExistsById(cardId);

    cardService.ensureCardPasswordIsValid(password, card.password);
    await ensurePurchaseFulfillRequirements(card, business, amount);

    await paymentRepository.insert({ cardId, businessId, amount });
}

export async function makeOnlinePurchase(onlinePurchaseData: OnlinePurchase) {
    const { businessId, number, cardHolderName, securityCode, expirationDate, amount } = onlinePurchaseData;

    const business = await ensureBusinessExists(businessId);
    const card = await cardService.ensureCardExistsByCardDetail(number, cardHolderName, expirationDate);

    cardService.ensureCardSecurityCodeIsValid(securityCode, card.securityCode);
    await ensurePurchaseFulfillRequirements(card, business, amount);

    await paymentRepository.insert({ cardId: card.id, businessId, amount });
}
