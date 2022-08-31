import { Response } from 'express';

interface Error {
    type: string;
    message: string | string[];
}

export function missingHeaderError(credential: string): Error {
    return { type: 'error_unauthorized', message: `Header '${credential}' is missing` };
}

export function unauthorizedError(credential: string): Error {
    return { type: 'error_unauthorized', message: `Invalid or non-existent ${credential}` };
}

export function forbiddenError(action: string): Error {
    return { type: 'error_forbidden', message: `Cannot ${action}` };
}

export function notFoundError(entity: string): Error {
    return { type: 'error_not_found', message: `Could not find specified ${entity}` };
}

export function conflictError(entity: string): Error {
    return { type: 'error_conflict', message: `${entity} already exists` };
}

export function unprocessableEntityError(errors: string[]): Error {
    return { type: 'error_unprocessable_entity', message: errors };
}

function errorHandler(err, _req, res: Response, _next) {
    if (err.type === 'error_unauthorized') {
        return res.status(401).send(err.message);
    }

    if (err.type === 'error_forbidden') {
        return res.status(403).send(err.message);
    }

    if (err.type === 'error_not_found') {
        return res.status(404).send(err.message);
    }

    if (err.type === 'error_conflict') {
        return res.status(409).send(err.message);
    }

    if (err.type === 'error_unprocessable_entity') {
        return res.status(422).send(err.message);
    }

    return res.status(500).send(err.message);
}

export default errorHandler;
