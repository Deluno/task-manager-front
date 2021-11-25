import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from 'src/app/shared/models/user.model';
import { TokenStorageService } from './token-storage.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { ApiEndpointsService } from 'src/app/shared/services/api-endpoints.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  signInStatusChange$ = new BehaviorSubject<User>(null);
  private _autoLogoutTimer: any;

  constructor(
    private api: ApiEndpointsService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private tokenStorageService: TokenStorageService,
    private tasksService: TasksService
  ) {}

  signin(username: string, password: string) {
    return this.api.signin(username, password).pipe(
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
    return this.api.signup(username, email, password).pipe(
      catchError(this.handleError),
      tap((resData) => {
        this.handleSign(resData.accessToken, resData.refreshToken);
      })
    );
  }

  logout() {
    this.tokenStorageService.clearStorage();
    this.tasksService.clearTasks();
    this.signInStatusChange$.next(null);
    this.router.navigate(['/auth', 'sign-in']);
    this.clearAutoLogoutTimer();
  }

  autoLogout(accessTokenExp: Date) {
    const expDuration = accessTokenExp.getTime() - new Date().getTime();
    this._autoLogoutTimer = setTimeout(() => {
      const refresher = this.tokenStorageService.getRefreshToken();

      this.api.refresh(refresher).subscribe(
        (resData) => {
          this.clearAutoLogoutTimer();
          this.handleSign(resData.accessToken, resData.refreshToken);
        },
        (errorRes) => {
          this.logout();
        }
      );
    }, expDuration);
  }

  isSignedIn() {
    return !!this.tokenStorageService.getAccessToken();
  }

  isAdmin() {
    return this.tokenStorageService.getUser()?.role === 'admin';
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
