import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Middleware to track user activity
export function trackUserActivity(req: Request, res: Response, next: NextFunction) {
  // Only track for authenticated users
  if (req.session?.user?.id) {
    // Update user activity in background, don't wait for it
    db.update(users)
      .set({ 
        lastActivityAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, req.session.user.id))
      .catch(error => {
        console.error('Failed to update user activity:', error);
        // Don't fail the request if activity tracking fails
      });
  }
  
  next();
}

// Enhanced authentication middleware with better error handling
export function requireAuthWithErrorHandling(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Vous devez être connecté pour accéder à cette ressource',
      code: 'AUTH_REQUIRED'
    });
  }
  next();
}

// Enhanced admin middleware with better error handling
export function requireAdminWithErrorHandling(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Vous devez être connecté pour accéder à cette ressource',
      code: 'AUTH_REQUIRED'
    });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'Vous devez être administrateur pour accéder à cette ressource',
      code: 'ADMIN_REQUIRED'
    });
  }
  
  next();
}