import { Injectable } from '@angular/core';
import { User } from '../user.model';

const ACCESS_TOKEN_KEY = 'auth-access-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  clearStorage(): void {
    sessionStorage.clear();
  }

  saveAccessToken(token: string): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  saveRefreshToken(token: string): void {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  saveUser(user: User): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): User {
    const user = sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return;
  }
}
