import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  users: User[] = [];

  private _usersUpdatesSub: Subscription;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.users = this.usersService.getUsers();
    this._usersUpdatesSub = this.usersService.usersUpdates$.subscribe(() => {
      this.users = this.usersService.getUsers();
    });
  }

  ngOnDestroy(): void {
    this._usersUpdatesSub.unsubscribe();
  }
}
