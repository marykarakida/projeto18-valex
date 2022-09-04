import * as cardService from './cardService.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';

// BUSINESS RULES

export async function getCardRechargeHistory(cardId: number) {
    const result = await rechargeRepository.findByCardId(cardId);

    return result;
}

// CRUD OPERATIONS

export async function rechargeCard(cardId: number, amount: number) {
    const card = await cardService.ensureCardExistsById(cardId);
    cardService.ensureCardIsActive(card.password);
    cardService.ensureCardHasNotExpired(card.expirationDate);

    await rechargeRepository.insert({ cardId, amount });
}
