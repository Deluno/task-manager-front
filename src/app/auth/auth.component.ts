import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { paswordsMatchValidator } from '../shared/passwords-match-validator.directive';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isSignUp = false;
  isLoading = false;
  authForm: FormGroup;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isSignUp = this.router.url === '/auth/sign-up';
    this.initForm();
  }

  onSubmit() {
    if (!this.authForm.valid) return;

    const username = this.authForm.value.username;
    const password = this.authForm.value.password;

    let auth$: Observable<any>;

    this.isLoading = true;
    if (this.isSignUp) {
    } else {
      auth$ = this.authService.signin(username, password);
    }

    auth$.subscribe(
      (res) => {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      (errorMessage) => {
        console.log(errorMessage);
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
