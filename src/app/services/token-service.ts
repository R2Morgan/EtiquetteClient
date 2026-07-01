import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    console.log('Initializing token service...');
    const access = await Preferences.get({ key: 'accessToken' });
    const refresh = await Preferences.get({ key: 'refreshToken' });
    console.log('Loaded from Preferences:', access.value, refresh.value);
    this.accessToken = access.value;
    this.refreshToken = refresh.value;
    this.initialized = true;
  }

  async setTokens(access: string, refresh: string) {
    console.log('Setting tokens...');
    this.accessToken = access;
    this.refreshToken = refresh;
    await Preferences.set({ key: 'accessToken', value: access });
    await Preferences.set({ key: 'refreshToken', value: refresh });
    console.log('Tokens saved to Preferences');
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  async setAccessToken(token: string) {
    this.accessToken = token;
    await Preferences.set({ key: 'accessToken', value: token });
  }

  async clear() {
    this.accessToken = null;
    this.refreshToken = null;
    await Preferences.remove({ key: 'accessToken' });
    await Preferences.remove({ key: 'refreshToken' });
  }

  isLoggedIn(): boolean {
    return this.accessToken !== null;
  }
}
