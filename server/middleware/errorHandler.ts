import { Request, Response, NextFunction } from 'express';

// Middleware global d'erreur Express
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(status).json({ message, status });
};

export default errorHandler;