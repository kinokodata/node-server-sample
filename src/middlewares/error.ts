import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const response: ApiResponse = { error: 'Internal Server Error' };
    res.status(500).json(response);
};