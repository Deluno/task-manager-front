import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuCollapsed = true;
  isAuth = false;
  private authSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.user$.subscribe((user) => {
      this.isAuth = !!user;
    });
  }

  toggleCollapse(state?: boolean) {
    this.isMenuCollapsed = state ? state : !this.isMenuCollapsed;
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
