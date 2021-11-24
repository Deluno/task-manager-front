import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { ApiEndpointsService } from 'src/app/shared/services/api-endpoints.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userPreloadStatus$ = new Subject<boolean>();
  usersUpdates$ = new Subject<boolean>();

  private _users: User[] = [];

  constructor(private api: ApiEndpointsService) {}

  getUsers() {
    return this._users.slice();
  }

  preloadUsers() {
    return this.api.getUsers().pipe(
      tap((users) => {
        this._users = users;
        this.userPreloadStatus$.next(true);
      })
    );
  }

  clearUsers() {
    this._users = [];
  }

  deleteUser(username: string) {
    return this.api.deleteUser(username).pipe(
      tap(() => {
        const userIndex = this._users.findIndex(
          (user) => user.username === username
        );
        this._users.splice(userIndex, 1);
        this.usersUpdates$.next(true);
      })
    );
  }
}
