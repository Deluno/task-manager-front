import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksResolver implements Resolve<Task[]> {
  constructor(private http: HttpClient) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Task[] | Observable<Task[]> | Promise<Task[]> {
    const day = route.queryParams['day'];
    return [new Task()];
  }
}
