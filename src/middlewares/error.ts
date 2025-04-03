import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types/errorResponse";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const response: ErrorResponse = { error: "Internal Server Error" };
    res.status(500).json(response);
};