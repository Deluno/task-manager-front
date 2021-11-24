import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuCollapsed = true;
  isAuth: boolean;
  user: User;
  private _authSub: Subscription;

  constructor(private authService: AuthService) {}

  get today() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
  }

  ngOnInit(): void {
    this.authService.signInStatusChange$.subscribe((user) => {
      this.isAuth = !!user;
      this.user = user;
    });
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
