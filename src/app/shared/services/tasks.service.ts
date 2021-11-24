import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Task } from '../models/task.model';
import { ApiEndpointsService } from '../services/api-endpoints.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasksPreloadStatus$ = new Subject<boolean>();
  tasksUpdates$ = new Subject<boolean>();

  private _tasks: Task[] = [];
  private _user: string;

  get user() {
    return this._user;
  }

  constructor(private api: ApiEndpointsService) {}

  getTasks() {
    return this._tasks
      .sort((a, b) => {
        if (a.datetime.getTime() > b.datetime.getTime()) return 1;
        if (a.datetime.getTime() === b.datetime.getTime()) return 0;
        if (a.datetime.getTime() < b.datetime.getTime()) return -1;
      })
      .slice();
  }

  preloadTasks(username: string) {
    this._user = username;
    return this.api.getTasks(username).pipe(
      tap((tasks) => {
        this._tasks = tasks;
        this.tasksPreloadStatus$.next(true);
      })
    );
  }

  clearTasks() {
    this._tasks = [];
  }

  getTask(id: number) {
    return this._tasks.find((task) => task.id === id);
  }

  getTasksOnDate(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const tasks = this.getTasks().filter((task) => {
      return start <= task.datetime && task.datetime <= end;
    });

    return tasks;
  }

  hasTasksOnDate(date: Date) {
    const hasTasks = this.getTasksOnDate(date);

    return hasTasks.length > 0;
  }

  updateTask(username: string, task: Task) {
    const taskIndex = this._tasks.findIndex((aTask) => aTask.id === task.id);
    this._tasks[taskIndex] = task;
    return this.api.patchTask(username, task).pipe(
      tap(() => {
        this.tasksUpdates$.next(true);
      })
    );
  }

  createTask(username: string, task: Task) {
    return this.api.postTask(username, task).pipe(
      tap((res) => {
        this._tasks.push(
          new Task(
            task.datetime,
            task.title,
            task.description,
            res['id'],
            res['usr']
          )
        );
        this.tasksUpdates$.next(true);
      })
    );
  }

  deleteTask(username: string, taskId: number) {
    return this.api.deleteTask(username, taskId).pipe(
      tap(() => {
        const taskIndex = this._tasks.findIndex((aTask) => aTask.id === taskId);
        this._tasks.splice(taskIndex, 1);
        this.tasksUpdates$.next(true);
      })
    );
  }
}
