import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuCollapsed = true;
  isAuth: boolean;
  private _user: User;
  private _authSub: Subscription;

  constructor(private authService: AuthService) {}

  get username() {
    return this._user.username;
  }

  ngOnInit(): void {
    this.authService.signInStatusChange$.subscribe((user) => {
      this.isAuth = !!user;
      this._user = user;
    });
    this.authService.autoSignIn();
  }

  toggleCollapse(state?: boolean) {
    this.isMenuCollapsed = state ? state : !this.isMenuCollapsed;
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this._authSub.unsubscribe();
  }
}
