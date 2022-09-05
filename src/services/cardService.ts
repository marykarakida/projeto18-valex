import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

import { notFoundError, conflictError, forbiddenError, unauthorizedError } from '../middlewares/errorMiddleware.js';
import ensureCompanyExists from './companyService.js';
import ensureEmployeeExists from './exployeeService.js';
import * as paymentService from './paymentService.js';
import * as rechargeService from './rechargeService.js';
import * as cardRepository from '../repositories/cardRepository.js';
import { abreviateMiddleName, sumTotalAmount } from '../utils/cardUtils.js';

dayjs.extend(customParseFormat);

// BUSINESS RULES

export async function ensureCardExistsById(cardId: number): Promise<cardRepository.Card> {
    const card = await cardRepository.findById(cardId);
    if (!card) throw notFoundError('card');

    return card;
}

export async function ensureCardExistsByCardDetail(
    number: string,
    cardHolderName: string,
    expirationDate: string
): Promise<cardRepository.Card> {
    const card = await cardRepository.findByCardDetails(number, cardHolderName, expirationDate);
    if (!card) throw notFoundError('card');

    return card;
}

export function ensureEmployeeIsCardOwner(employeeId: number, cardOwnerId: number) {
    if (employeeId !== cardOwnerId) throw forbiddenError("activate another user's card");
}

export function ensureCardIsActive(password: string) {
    if (!password) throw forbiddenError('recharge inactive card');
}

export function ensureCardIsInactive(password: string) {
    if (password) throw forbiddenError('activate card more than once');
}

export function ensureCardIsUnblocked(isBlocked: boolean) {
    if (isBlocked) throw forbiddenError('make purchases with a blocked card');
}

export function ensureCardIsBlocked(isBlocked: boolean) {
    if (!isBlocked) throw forbiddenError('make purchases with a blocked card');
}

export function ensureCardHasNotExpired(expirationDate: string) {
    const hasCardExpired = !dayjs().isBefore(dayjs(expirationDate, 'MM/YY'), 'month');
    if (hasCardExpired) throw forbiddenError('activate expired card');
}

export async function ensureCardHasBalance(cardId: number, amount: number) {
    const cardRechargeHistory = await rechargeService.getCardRechargeHistory(cardId);
    const cardPurchaseHistory = await paymentService.getCardPaymentHistory(cardId);

    const cardBalance = sumTotalAmount(cardRechargeHistory) - sumTotalAmount(cardPurchaseHistory);
    if (cardBalance - amount < 0) throw forbiddenError('complete purchase due to insuficient money');
}

export function ensureCardSecurityCodeIsValid(securityCode: string, cardSecurityCode: string) {
    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);
    if (securityCode !== cryptr.decrypt(cardSecurityCode)) throw unauthorizedError('security code');
}

export function ensureCardPasswordIsValid(password: string, cardPassword: string) {
    if (!bcrypt.compareSync(password, cardPassword)) throw unauthorizedError('purchase info');
}

export function ensureTypeIsSame(businessType: cardRepository.TransactionTypes, cardType: cardRepository.TransactionTypes) {
    if (businessType !== cardType) throw unauthorizedError('card type');
}

export async function ensureOneCardPerTypePerEmployee(type: cardRepository.TransactionTypes, employeeId: number) {
    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (card) throw conflictError('card type');
}

// CRUD OPERATIONS

export async function createCard(apiKey: string, employeeId: number, type: cardRepository.TransactionTypes) {
    const employee = await ensureEmployeeExists(employeeId);

    await ensureCompanyExists(apiKey);
    await ensureOneCardPerTypePerEmployee(type, employeeId);

    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);

    const cardData = {
        employeeId,
        number: faker.finance.creditCardNumber('#### #### #### ####'),
        cardholderName: abreviateMiddleName(employee.fullName),
        securityCode: cryptr.encrypt(faker.finance.creditCardCVV()),
        expirationDate: dayjs().add(5, 'years').format('MM/YY'),
        isVirtual: false,
        isBlocked: false,
        type,
    };
    await cardRepository.insert(cardData);
}

export async function activateCard(employeeId: number, cardId: number, password: string, securityCode: string) {
    const card = await ensureCardExistsById(cardId);

    ensureEmployeeIsCardOwner(employeeId, card.employeeId);
    ensureCardIsInactive(card.password);
    ensureCardSecurityCodeIsValid(securityCode, card.securityCode);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await cardRepository.update(cardId, { password: hashedPassword });
}

export async function blockCard(employeeId: number, cardId: number, password: string) {
    const card = await ensureCardExistsById(cardId);

    ensureEmployeeIsCardOwner(employeeId, card.employeeId);
    ensureCardPasswordIsValid(password, card.password);
    ensureCardHasNotExpired(card.expirationDate);
    ensureCardIsUnblocked(card.isBlocked);

    await cardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(employeeId: number, cardId: number, password: string) {
    const card = await ensureCardExistsById(cardId);

    ensureEmployeeIsCardOwner(employeeId, card.employeeId);
    ensureCardPasswordIsValid(password, card.password);
    ensureCardHasNotExpired(card.expirationDate);
    ensureCardIsBlocked(card.isBlocked);

    await cardRepository.update(cardId, { isBlocked: false });
}
