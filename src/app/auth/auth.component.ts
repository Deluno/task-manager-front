import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from './services/auth.service';
import { AuthResponse } from '../shared/services/api-endpoints.service';
import { TokenStorageService } from './services/token-storage.service';
import { paswordsMatchValidator } from '../shared/passwords-match-validator.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isSignUp: boolean;
  isLoading: boolean;
  errorMessage: string;
  authForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.signInStatusChange$.pipe(take(1)).subscribe(
      (user) => {
        if (user) {
          this.router
            .navigate(['/users', user.username, 'calendar'])
            .then(() => {
              this.isLoading = false;
            });
        }
      },
      () => {},
      () => (this.isLoading = false)
    );
    this.isSignUp = this.router.url === '/auth/sign-up';
    this.initForm();
  }

  onSubmit() {
    if (!this.authForm.valid) return;

    const username = this.authForm.value.username;
    const password = this.authForm.value.password;

    let auth$: Observable<AuthResponse>;

    this.isLoading = true;
    if (this.isSignUp) {
      const email = this.authForm.value.email;
      auth$ = this.authService.signup(username, email, password);
    } else {
      auth$ = this.authService.signin(username, password);
    }

    auth$.subscribe(
      (res) => {
        const user = this.tokenStorageService.getUser();
        this.router.navigate(['/users', user.username, 'calendar']).then(() => {
          this.isLoading = false;
        });
      },
      (errorMessage) => {
        this.isLoading = false;
        this.errorMessage = errorMessage;
      }
    );

    this.authForm.reset();
  }

  private initForm() {
    this.authForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });

    if (this.isSignUp) {
      this.authForm.addControl(
        'email',
        new FormControl('', [Validators.required, Validators.email])
      );
      this.authForm.addControl(
        'confirmPassword',
        new FormControl('', [Validators.required])
      );
      this.authForm.addValidators(paswordsMatchValidator);
    }
  }
}
