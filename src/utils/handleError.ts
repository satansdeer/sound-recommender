import { Response } from 'express';

interface ErrorParams {
    res: Response;
    error: unknown;
    message: string;
    defaultErrorMessage?: string;
}

const handleError = ({ res, error, message, defaultErrorMessage = 'An unknown error occurred' }: ErrorParams): void => {
    if (error instanceof Error) {
        res.status(500).json({ message: message, error: error.message });
    } else {
        res.status(500).json({ message: message, error: defaultErrorMessage });
    }
};

export default handleError;

