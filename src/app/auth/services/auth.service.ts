import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../user.model';
import { TokenStorageService } from './token-storage.service';

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  signInStatusChange$ = new Subject<User>();
  private _autoLogoutTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private tokenStorageService: TokenStorageService
  ) {}

  signin(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        environment.taskManagerAPIPath + '/auth/login',
        { username, password },
        httpOptions
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleSign(resData.accessToken, resData.refreshToken);
        })
      );
  }

  autoSignIn() {
    const accessToken = this.tokenStorageService.getAccessToken();
    if (!accessToken) return;

    const user = this.tokenStorageService.getUser();
    this.signInStatusChange$.next(user);
    const accessTokenExp = this.jwtHelper.getTokenExpirationDate(accessToken);
    this.autoLogout(accessTokenExp);
  }

  signup(username: string, email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        environment.taskManagerAPIPath + '/auth/register',
        { username, email, password },
        httpOptions
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleSign(resData.accessToken, resData.refreshToken);
        })
      );
  }

  logout() {
    this.tokenStorageService.clearStorage();
    this.signInStatusChange$.next(null);
    this.router.navigate(['/auth', 'sign-in']);
    this.clearAutoLogoutTimer();
  }

  autoLogout(accessTokenExp: Date) {
    const expDuration = accessTokenExp.getTime() - new Date().getTime();
    this._autoLogoutTimer = setTimeout(() => {
      this.refreshAccess().subscribe(
        (resData) => {
          // alert('autoLoginRefresh');

          this.clearAutoLogoutTimer();
          this.handleSign(resData.accessToken, resData.refreshToken);
        },
        (errorRes) => {
          this.logout();
        }
      );
    }, expDuration);
  }

  private refreshAccess() {
    const refresher = this.tokenStorageService.getRefreshToken();
    return this.http.post<AuthResponseData>(
      environment.taskManagerAPIPath + '/auth/refresh',
      {
        refreshToken: refresher,
      },
      httpOptions
    );
  }

  isSignedIn() {
    return !!this.tokenStorageService.getAccessToken();
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    const status = errorRes.status;
    switch (true) {
      case status == 404 || status == 401:
        errorMessage = 'Your username and/or password do not match.';
        break;
      case status == 409:
        errorMessage = 'Username and/or E-mail already exists.';
        break;
    }
    return throwError(errorMessage);
  }

  private handleSign(accessToken: string, refreshToken: string) {
    const userData = this.jwtHelper.decodeToken(accessToken);
    const user = new User(userData.username, userData.role);

    this.tokenStorageService.saveUser(user);
    this.tokenStorageService.saveAccessToken(accessToken);
    this.tokenStorageService.saveRefreshToken(refreshToken);

    this.signInStatusChange$.next(user);

    const accessTokenExp = this.jwtHelper.getTokenExpirationDate(accessToken);
    this.autoLogout(accessTokenExp);
  }

  private clearAutoLogoutTimer() {
    if (this._autoLogoutTimer) {
      clearTimeout(this._autoLogoutTimer);
    }
    this._autoLogoutTimer = null;
  }
}
