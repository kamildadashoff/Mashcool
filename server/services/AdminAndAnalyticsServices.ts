import { AdminMetrics, AppNotification, AnalyticsEvent, Locale } from '../../src/types';
import { vacancyService } from './VacancyService';
import { paymentService } from './PaymentService';

export class AdminService {
  getMetrics(): AdminMetrics {
    const sources = vacancyService.getSourcesHealth();
    const totalRevenue = paymentService.getTotalRevenue();

    return {
      totalUsers: 142,
      activeProfiles: 128,
      totalVacancies: 534,
      activeVacancies: 489,
      totalSearchRuns: 218,
      totalApplicationsSent: 1840,
      totalRevenueAZN: totalRevenue + 1250,
      avgAiCostJobLuckUSD: 0.0034,
      avgAiCostJobBlastUSD: 0.0058,
      p50AiCostUSD: 0.0032,
      p95AiCostUSD: 0.0071,
      aiSpendingSafetyLimitUSD: 100.0,
      currentMonthAiSpendUSD: 14.82,
      overallReplyRatePercent: 24.6,
      interviewRatePercent: 9.8,
      sources,
    };
  }
}

export class NotificationService {
  private notifications: AppNotification[] = [];

  constructor() {
    this.notifications.push({
      id: 'notif-001',
      userId: 'usr-kamil-dadashov',
      eventType: 'APPLICATION_REPLY_RECEIVED',
      payload: {
        companyName: 'Absheron Hotel Group',
        position: 'Lead Graphic Designer',
        replyType: 'INTERVIEW',
      },
      read: false,
      createdAt: '2026-08-21T11:40:00Z',
    });
  }

  getUserNotifications(userId: string): AppNotification[] {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addNotification(userId: string, eventType: AppNotification['eventType'], payload: Record<string, any>): AppNotification {
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId,
      eventType,
      payload,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    return notif;
  }

  markRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
  }
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  track(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent {
    const record: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...event,
      timestamp: new Date().toISOString(),
    };
    this.events.push(record);
    return record;
  }

  getEvents(limit = 100): AnalyticsEvent[] {
    return this.events.slice(-limit);
  }
}

export const adminService = new AdminService();
export const notificationService = new NotificationService();
export const analyticsService = new AnalyticsService();
