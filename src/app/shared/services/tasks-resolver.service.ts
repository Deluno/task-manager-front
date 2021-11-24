import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { Task } from '../models/task.model';
import { TasksService } from './tasks.service';

@Injectable({
  providedIn: 'root',
})
export class TasksResolver implements Resolve<Task[]> {
  constructor(private tasksService: TasksService) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Task[] | Observable<Task[]> | Promise<Task[]> {
    const preloadedUser = this.tasksService.user;
    const tasks = this.tasksService.getTasks();

    let user = route.params['username'];
    if (preloadedUser === user && tasks.length > 0) {
      return tasks;
    }

    if (tasks.length === 0 || preloadedUser !== user) {
      return this.tasksService.preloadTasks(user);
    }
  }
}
