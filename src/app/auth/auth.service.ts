import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from './user.model';

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>(null);
  private tokenExpTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  signup(username: string, email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `${environment.taskManagerAPIPath}/auth/register`,
      {
        username: username,
        email: email,
        password: password,
      }
    );
  }

  signin(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(`${environment.taskManagerAPIPath}/auth/login`, {
        username: username,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(resData.accessToken, resData.refreshToken);
        })
      );
  }

  autoSignin() {
    const userData: {
      username: string;
      role: string;
      _accessToken: string;
      _refreshToken: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new User(
      userData.username,
      userData.role,
      userData._accessToken,
      userData._refreshToken
    );

    if (loadedUser.accessToken) {
      if (this.jwtHelper.isTokenExpired(loadedUser.accessToken)) {
        this.user$.next(null);
        return;
      }
      this.user$.next(loadedUser);
      const tokenExpDate = this.jwtHelper.getTokenExpirationDate(
        loadedUser.accessToken
      );
      this.autoLogout(tokenExpDate);
    }
  }

  logout() {
    this.user$.next(null);
    this.router.navigate(['/auth', 'sign-in']);
    localStorage.removeItem('userData');
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }
    this.tokenExpTimer = null;
  }

  autoLogout(tokenExpDate: Date) {
    this.tokenExpTimer = setTimeout(() => {
      this.logout();
    }, new Date(tokenExpDate).getTime() - new Date().getTime());
  }

  private handleAuth(accessToken: string, refreshToken: string) {
    const accessTokenPayload = this.jwtHelper.decodeToken(accessToken);

    const user = new User(
      accessTokenPayload.username,
      accessTokenPayload.role,
      accessToken,
      refreshToken
    );

    this.user$.next(user);
    localStorage.setItem('userData', JSON.stringify(user));

    const tokenExpDate = this.jwtHelper.getTokenExpirationDate(accessToken);
    this.autoLogout(tokenExpDate);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    console.log(errorRes);

    return throwError(errorMessage);
  }
}
