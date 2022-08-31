import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

import { TransactionTypes } from '../repositories/cardRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as companyRepository from '../repositories/companyRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';

import { notFoundError, conflictError, forbiddenError, unauthorizedError } from '../middlewares/errorMiddleware.js';

import abreviateMiddleName from '../utils/cardUtils.js';

dayjs.extend(customParseFormat);

export async function createCard(apiKey: string, employeeId: number, type: TransactionTypes) {
    const company = await companyRepository.findByApiKey(apiKey);
    if (!company) {
        throw notFoundError('company');
    }

    const employee = await employeeRepository.findById(employeeId);
    if (!employee) {
        throw notFoundError('employee');
    }

    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (card) {
        throw conflictError('card type');
    }

    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);

    const number = faker.finance.creditCardNumber();
    const cardholderName = abreviateMiddleName(employee.fullName);
    const securityCode = cryptr.encrypt(faker.finance.creditCardCVV());
    const expirationDate = dayjs().add(5, 'years').format('MM/YY');

    const cardData = {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type,
    };

    await cardRepository.insert(cardData);
}

export async function activateCard(cardId: number, password: string, securityCode: string) {
    const card = await cardRepository.findById(cardId);
    if (!card) {
        throw notFoundError('card');
    }

    if (!dayjs().isBefore(dayjs(card.expirationDate, 'MM/YY'), 'month')) {
        throw forbiddenError('activate card');
    }

    if (card.password) {
        throw forbiddenError('activate card more than once');
    }

    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);

    if (securityCode !== cryptr.decrypt(card.securityCode)) {
        throw unauthorizedError('security code');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await cardRepository.update(cardId, { password: hashedPassword });
}
