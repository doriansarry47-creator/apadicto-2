export type SecurityEventType = 
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'PASSWORD_RESET_BLOCKED'
  | 'INVALID_TOKEN_ATTEMPT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SUSPICIOUS_ACTIVITY';

export interface SecurityEvent {
  type: SecurityEventType;
  email?: string;
  ipAddress: string;
  userAgent?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export class SecurityAuditService {
  private static events: SecurityEvent[] = [];
  private static readonly MAX_EVENTS = 1000; // Keep last 1000 events in memory

  static logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
    };

    // Add to in-memory array
    this.events.unshift(securityEvent);
    
    // Keep only the latest events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS);
    }

    // Log to console with appropriate level
    this.logToConsole(securityEvent);

    // In a production environment, you would also:
    // - Send to external logging service (e.g., Datadog, CloudWatch)
    // - Store in database for long-term analysis
    // - Send alerts for critical events
  }

  private static logToConsole(event: SecurityEvent): void {
    const logMessage = this.formatLogMessage(event);
    
    switch (event.type) {
      case 'PASSWORD_RESET_BLOCKED':
      case 'RATE_LIMIT_EXCEEDED':
      case 'SUSPICIOUS_ACTIVITY':
        console.warn(`🚨 ${logMessage}`);
        break;
      case 'INVALID_TOKEN_ATTEMPT':
        console.warn(`⚠️ ${logMessage}`);
        break;
      case 'PASSWORD_RESET_REQUESTED':
      case 'PASSWORD_RESET_COMPLETED':
        console.log(`🔐 ${logMessage}`);
        break;
      default:
        console.log(`📋 ${logMessage}`);
    }
  }

  private static formatLogMessage(event: SecurityEvent): string {
    const parts = [
      `[${event.type}]`,
      event.email ? `email=${event.email}` : null,
      `ip=${event.ipAddress}`,
      event.details ? `details=${JSON.stringify(event.details)}` : null,
    ].filter(Boolean);

    return parts.join(' ');
  }

  static getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(0, limit);
  }

  static getEventsByType(type: SecurityEventType, limit: number = 50): SecurityEvent[] {
    return this.events
      .filter(event => event.type === type)
      .slice(0, limit);
  }

  static getEventsByEmail(email: string, limit: number = 50): SecurityEvent[] {
    return this.events
      .filter(event => event.email === email)
      .slice(0, limit);
  }

  static getEventsByIP(ipAddress: string, limit: number = 50): SecurityEvent[] {
    return this.events
      .filter(event => event.ipAddress === ipAddress)
      .slice(0, limit);
  }

  static getSuspiciousActivity(timeWindowMinutes: number = 60): {
    suspiciousIPs: string[];
    suspiciousEmails: string[];
    summary: Record<string, number>;
  } {
    const cutoff = new Date(Date.now() - (timeWindowMinutes * 60 * 1000));
    const recentEvents = this.events.filter(event => event.timestamp > cutoff);

    // Count events by IP
    const ipCounts: Record<string, number> = {};
    const emailCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};

    recentEvents.forEach(event => {
      ipCounts[event.ipAddress] = (ipCounts[event.ipAddress] || 0) + 1;
      if (event.email) {
        emailCounts[event.email] = (emailCounts[event.email] || 0) + 1;
      }
      typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
    });

    // Find suspicious IPs (more than 10 events in the time window)
    const suspiciousIPs = Object.entries(ipCounts)
      .filter(([, count]) => count > 10)
      .map(([ip]) => ip);

    // Find suspicious emails (more than 5 reset attempts in the time window)
    const suspiciousEmails = Object.entries(emailCounts)
      .filter(([, count]) => count > 5)
      .map(([email]) => email);

    return {
      suspiciousIPs,
      suspiciousEmails,
      summary: typeCounts,
    };
  }

  static clearEvents(): void {
    this.events = [];
    console.log('🧹 Security audit events cleared');
  }
}