import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';

import { Task } from 'src/app/shared/models/task.model';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'task-modal-content',
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
      <div class="modal-header">
        <h4 class="modal-title">{{ task ? 'Edit' : 'New' }}</h4>
        <button
          type="button"
          class="close"
          aria-label="Close"
          (click)="activeModal.dismiss('Cross click')"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group col-12 col-sm-3">
            <label for="time">Time:</label>
            <input
              type="time"
              name="time"
              class="form-control"
              id="time"
              formControlName="time"
            />
          </div>
          <div class="form-group col">
            <label for="title">Title:</label>
            <input
              type="text"
              name="title"
              class="form-control"
              id="title"
              formControlName="title"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col">
            <label for="description">Description:</label>
            <input
              type="text"
              name="description"
              class="form-control"
              id="description"
              formControlName="description"
            />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="submit"
          class="btn"
          [ngClass]="task ? 'btn-primary' : 'btn-success'"
          [disabled]="!taskForm.valid"
        >
          {{ task ? 'Update' : 'Save' }}
        </button>
        <button
          type="button"
          class="btn btn-danger"
          (click)="activeModal.close('Close click')"
        >
          Close
        </button>
      </div>
    </form>
  `,
})
export class TaskModalContent implements OnInit {
  @Input() task: Task;
  @Input() day: Date;
  private _today: Date;

  taskForm: FormGroup = new FormGroup({
    time: new FormControl(),
    title: new FormControl(null, [Validators.required]),
    description: new FormControl(),
  });

  constructor(
    public activeModal: NgbActiveModal,
    private tasksService: TasksService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const d = new Date();
    const timeNow = `${d.getHours()}:${d.getMinutes()}`;

    this.taskForm.setValue({
      time: this.task?.time || timeNow,
      title: this.task?.title || this.task,
      description: this.task?.description || this.task,
    });
    this._today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  onSubmit() {
    const time = this.taskForm.value.time;
    const title = this.taskForm.value.title;
    const description = this.taskForm.value.description;

    const user = this.route.snapshot.children[0].firstChild.params['username'];
    const datetime = this.day ? new Date(this.day) : this._today;

    datetime.setHours(time.split(':')[0]);
    datetime.setMinutes(time.split(':')[1]);

    let task: Task;
    if (this.task) {
      task = new Task(datetime, title, description, this.task.id);
      this.tasksService
        .updateTask(user, task)
        .subscribe(() => this.activeModal.close('Submit'));
    } else {
      task = new Task(datetime, title, description);
      this.tasksService
        .createTask(user, task)
        .subscribe(() => this.activeModal.close('Submit'));
    }
  }
}

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css'],
})
export class TaskModalComponent implements OnInit {
  @Input() taskId: number;

  private _task: Task;
  private _config: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    centered: true,
  };

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private tasksService: TasksService
  ) {}

  ngOnInit() {
    this._task = this.tasksService.getTask(this.taskId);
  }

  open() {
    const day = this.route.snapshot.params['day'];

    const modalRef = this.modalService.open(TaskModalContent, this._config);
    modalRef.componentInstance.task = this._task || null;
    modalRef.componentInstance.day = day || null;
  }
}
