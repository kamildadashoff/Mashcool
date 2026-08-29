import { User, UserIdentity, Locale } from '../../src/types';

export class AuthService {
  private users: Map<string, User> = new Map();
  private emailToUserId: Map<string, string> = new Map();
  private telegramToUserId: Map<string, string> = new Map();

  constructor() {
    // Seed default demo user for frictionless instant preview
    const defaultUser: User = {
      id: 'usr-kamil-dadashov',
      email: 'kamildadashoff@gmail.com',
      name: 'Kamil Dadashov',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
      preferredLocale: 'az',
      role: 'ADMIN',
      createdAt: '2026-08-20T10:00:00Z',
      identities: [
        {
          provider: 'EMAIL',
          providerId: 'kamildadashoff@gmail.com',
          email: 'kamildadashoff@gmail.com',
          displayName: 'Kamil Dadashov',
          connectedAt: '2026-08-20T10:00:00Z',
        },
        {
          provider: 'GOOGLE',
          providerId: 'google-1092834710',
          email: 'kamildadashoff@gmail.com',
          displayName: 'Kamil Dadashov',
          connectedAt: '2026-08-20T10:05:00Z',
        },
        {
          provider: 'TELEGRAM',
          providerId: '98412034',
          displayName: '@kamil_dadashoff',
          connectedAt: '2026-08-21T14:30:00Z',
        }
      ],
      emailConnection: {
        provider: 'GMAIL',
        email: 'kamildadashoff@gmail.com',
        connectedAt: '2026-08-20T10:10:00Z',
        active: true,
      }
    };

    this.users.set(defaultUser.id, defaultUser);
    this.emailToUserId.set(defaultUser.email.toLowerCase(), defaultUser.id);
    this.telegramToUserId.set('98412034', defaultUser.id);
  }

  getUserById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getUserByEmail(email: string): User | undefined {
    const id = this.emailToUserId.get(email.toLowerCase());
    return id ? this.users.get(id) : undefined;
  }

  getUserByTelegramId(telegramId: string): User | undefined {
    const id = this.telegramToUserId.get(telegramId);
    return id ? this.users.get(id) : undefined;
  }

  registerOrLoginWithEmail(email: string, name?: string, locale: Locale = 'az'): { user: User; isNew: boolean } {
    const cleanEmail = email.toLowerCase().trim();
    let user = this.getUserByEmail(cleanEmail);

    if (user) {
      return { user, isNew: false };
    }

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      preferredLocale: locale,
      role: 'USER',
      createdAt: new Date().toISOString(),
      identities: [
        {
          provider: 'EMAIL',
          providerId: cleanEmail,
          email: cleanEmail,
          displayName: name,
          connectedAt: new Date().toISOString(),
        }
      ]
    };

    this.users.set(newUser.id, newUser);
    this.emailToUserId.set(cleanEmail, newUser.id);
    return { user: newUser, isNew: true };
  }

  loginWithGoogle(email: string, name: string, googleId: string, avatarUrl?: string): { user: User; isNew: boolean } {
    const cleanEmail = email.toLowerCase().trim();
    let user = this.getUserByEmail(cleanEmail);

    if (user) {
      // Link Google identity if not already linked
      const hasGoogle = user.identities.some(i => i.provider === 'GOOGLE');
      if (!hasGoogle) {
        user.identities.push({
          provider: 'GOOGLE',
          providerId: googleId,
          email: cleanEmail,
          displayName: name,
          connectedAt: new Date().toISOString(),
        });
      }
      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      return { user, isNew: false };
    }

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      name,
      avatarUrl,
      preferredLocale: 'az',
      role: 'USER',
      createdAt: new Date().toISOString(),
      identities: [
        {
          provider: 'GOOGLE',
          providerId: googleId,
          email: cleanEmail,
          displayName: name,
          connectedAt: new Date().toISOString(),
        }
      ],
      emailConnection: {
        provider: 'GMAIL',
        email: cleanEmail,
        connectedAt: new Date().toISOString(),
        active: true,
      }
    };

    this.users.set(newUser.id, newUser);
    this.emailToUserId.set(cleanEmail, newUser.id);
    return { user: newUser, isNew: true };
  }

  // Cross-channel sync: link Telegram identity to existing user or create Telegram user
  linkTelegramIdentity(userId: string, telegramId: string, telegramUsername: string): User {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');

    const existingIdx = user.identities.findIndex(i => i.provider === 'TELEGRAM');
    if (existingIdx >= 0) {
      user.identities[existingIdx].providerId = telegramId;
      user.identities[existingIdx].displayName = `@${telegramUsername}`;
    } else {
      user.identities.push({
        provider: 'TELEGRAM',
        providerId: telegramId,
        displayName: `@${telegramUsername}`,
        connectedAt: new Date().toISOString(),
      });
    }

    this.telegramToUserId.set(telegramId, user.id);
    return user;
  }

  connectEmailProvider(userId: string, provider: 'GMAIL' | 'OUTLOOK', email: string): User {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');

    user.emailConnection = {
      provider,
      email: email.toLowerCase().trim(),
      connectedAt: new Date().toISOString(),
      active: true,
    };
    return user;
  }

  disconnectEmailProvider(userId: string): User {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    user.emailConnection = undefined;
    return user;
  }

  updatePreferredLocale(userId: string, locale: Locale): User {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    user.preferredLocale = locale;
    return user;
  }
}

export const authService = new AuthService();
