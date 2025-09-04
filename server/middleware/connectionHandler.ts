import { Request, Response, NextFunction } from 'express';

// Enhanced connection error handler with retry mechanism
export class ConnectionHandler {
  private static retryCount = 3;
  private static retryDelay = 1000; // 1 second

  static async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = ConnectionHandler.retryCount
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retries > 0 && ConnectionHandler.isRetryableError(error)) {
        console.log(`🔄 Retrying operation... ${retries} attempts remaining`);
        await ConnectionHandler.delay(ConnectionHandler.retryDelay);
        return ConnectionHandler.withRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  private static isRetryableError(error: any): boolean {
    const retryableMessages = [
      'ENOTFOUND',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ECONNRESET',
      'EPIPE'
    ];
    
    return retryableMessages.some(msg => 
      error.message?.includes(msg) || error.code?.includes(msg)
    );
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Middleware to handle database connection errors gracefully
  static handleDatabaseError(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('🔥 Database Error:', err);

    if (ConnectionHandler.isRetryableError(err)) {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Database connection failed. Please try again later.',
        retryAfter: 30,
        timestamp: new Date().toISOString()
      });
    }

    if (err.code === '23505') { // PostgreSQL unique violation
      return res.status(409).json({
        error: 'Conflict',
        message: 'A record with this data already exists.',
        timestamp: new Date().toISOString()
      });
    }

    if (err.code === '23503') { // PostgreSQL foreign key violation
      return res.status(400).json({
        error: 'Invalid reference',
        message: 'Referenced record does not exist.',
        timestamp: new Date().toISOString()
      });
    }

    // Generic database error
    return res.status(500).json({
      error: 'Database error',
      message: 'An unexpected database error occurred.',
      timestamp: new Date().toISOString()
    });
  }
}

// Enhanced middleware for API endpoints
export function withConnectionRetry(handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ConnectionHandler.withRetry(() => handler(req, res, next));
    } catch (error) {
      ConnectionHandler.handleDatabaseError(error, req, res, next);
    }
  };
}