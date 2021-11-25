import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/shared/models/task.model';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() task: Task;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {}

  onDelete() {
    const username = this.route.snapshot.parent.params['username'];
    this.tasksService.deleteTask(username, this.task.id).subscribe();
  }
}
