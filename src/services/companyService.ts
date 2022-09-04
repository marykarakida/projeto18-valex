import * as companyRepository from '../repositories/companyRepository.js';

import { notFoundError } from '../middlewares/errorMiddleware.js';

// BUSINESS RULES

export default async function ensureCompanyExists(apiKey: string) {
    const company = await companyRepository.findByApiKey(apiKey);
    if (!company) throw notFoundError('company');
}
