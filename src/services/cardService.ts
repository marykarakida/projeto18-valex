import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';

import { TransactionTypes } from '../repositories/cardRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as companyRepository from '../repositories/companyRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';

import { notFoundError, conflictError } from '../middlewares/errorMiddleware.js';

import abreviateMiddleName from '../utils/cardUtils.js';

async function createNewCard(apiKey: string, employeeId: number, type: TransactionTypes) {
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

export default createNewCard;
