import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { Task } from 'src/app/shared/models/task.model';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit, OnDestroy {
  private _date: Date;
  tasks: Task[] = [];

  private _tasksUpdatesSub: Subscription;

  get date(): string {
    if (this.getTodayDate().getTime() === this._date.getTime()) return 'Today';

    const year = this._date.getFullYear();
    const month = this._date.getMonth() + 1;
    const day = this._date.getDate();

    return `${day < 10 ? '0' + day : day}.${
      month < 10 ? '0' + month : month
    }.${year}`;
  }

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.setDay();
    this.route.params.subscribe((params: Params) => {
      this.setDay(params['day']);
    });
  }

  private setDay(day?: string) {
    this._date = day ? new Date(day) : this.getTodayDate();
    this.tasks = this.tasksService.getTasksOnDate(this._date);

    this._tasksUpdatesSub = this.tasksService.tasksUpdates$.subscribe(() => {
      this.tasks = this.tasksService.getTasksOnDate(this._date);
    });
  }

  private getTodayDate() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  ngOnDestroy(): void {
    console.log('called');

    this._tasksUpdatesSub.unsubscribe();
  }
}
