import { notFoundError } from '../middlewares/errorMiddleware.js';
import * as businessRepository from '../repositories/businessRepository.js';

// BUSINESS RULES

export default async function ensureBusinessExists(businessId: number) {
    const business = await businessRepository.findById(businessId);
    if (!business) throw notFoundError('business');

    return business;
}
