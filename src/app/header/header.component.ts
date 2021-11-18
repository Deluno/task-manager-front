import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { TokenStorageService } from '../auth/services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuCollapsed = true;
  isAuth: boolean;
  private _authSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.signInStatusChange$.subscribe((status) => {
      this.isAuth = status;
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
