import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class UsersResolver implements Resolve<User[]> {
  constructor(private usersService: UsersService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<User[]> | Promise<User[]> | User[] {
    const users = this.usersService.getUsers();

    if (users.length === 0) {
      return this.usersService.preloadUsers();
    } else {
      return users;
    }
  }
}
