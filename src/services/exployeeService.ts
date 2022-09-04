import * as employeeRepository from '../repositories/employeeRepository.js';

import { notFoundError } from '../middlewares/errorMiddleware.js';

// BUSINESS RULES

export default async function ensureEmployeeExists(employeeId: number) {
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) throw notFoundError('employee');

    return employee;
}
