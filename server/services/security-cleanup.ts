import { storage } from '../storage.js';
import { rateLimitService } from './rate-limit.js';

export class SecurityCleanupService {
  private static readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
  private static instance: SecurityCleanupService;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SecurityCleanupService {
    if (!SecurityCleanupService.instance) {
      SecurityCleanupService.instance = new SecurityCleanupService();
    }
    return SecurityCleanupService.instance;
  }

  start(): void {
    if (this.intervalId) {
      console.log('⚠️ Security cleanup service already running');
      return;
    }

    console.log('🧹 Starting security cleanup service...');
    
    // Run cleanup immediately
    this.performCleanup();

    // Set up recurring cleanup
    this.intervalId = setInterval(() => {
      this.performCleanup();
    }, SecurityCleanupService.CLEANUP_INTERVAL);

    console.log('✅ Security cleanup service started');
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🛑 Security cleanup service stopped');
    }
  }

  private async performCleanup(): Promise<void> {
    try {
      const now = new Date();
      
      // Clean up expired password reset tokens (older than 1 hour)
      const tokenCleanupDate = new Date(now.getTime() - (60 * 60 * 1000));
      const expiredTokens = await storage.cleanupExpiredPasswordResetTokens(tokenCleanupDate);
      
      // Clean up old password reset attempts (older than 24 hours)
      const attemptCleanupDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      const expiredAttempts = await storage.cleanupExpiredPasswordResetAttempts(attemptCleanupDate);
      
      // Clean up expired rate limit blocks
      const expiredBlocks = await rateLimitService.cleanupExpiredBlocks();

      if (expiredTokens > 0 || expiredAttempts > 0 || expiredBlocks > 0) {
        console.log(`🧹 Security cleanup completed: ${expiredTokens} tokens, ${expiredAttempts} attempts, ${expiredBlocks} blocks removed`);
      }
    } catch (error) {
      console.error('❌ Security cleanup failed:', error);
    }
  }

  async performManualCleanup(): Promise<{ tokens: number; attempts: number; blocks: number }> {
    const now = new Date();
    
    const tokenCleanupDate = new Date(now.getTime() - (60 * 60 * 1000));
    const expiredTokens = await storage.cleanupExpiredPasswordResetTokens(tokenCleanupDate);
    
    const attemptCleanupDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const expiredAttempts = await storage.cleanupExpiredPasswordResetAttempts(attemptCleanupDate);
    
    const expiredBlocks = await rateLimitService.cleanupExpiredBlocks();

    return {
      tokens: expiredTokens,
      attempts: expiredAttempts,
      blocks: expiredBlocks
    };
  }
}

export const securityCleanupService = SecurityCleanupService.getInstance();