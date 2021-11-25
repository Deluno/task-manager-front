import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/models/user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'task-modal-content',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div class="modal-header">
        <h4 class="modal-title">{{ user ? 'Edit' : 'New' }}</h4>
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
          <div class="form-group col">
            <label for="username">Username:</label>
            <input
              type="text"
              name="username"
              class="form-control"
              id="username"
              formControlName="username"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col">
            <label for="email">E-mail:</label>
            <input
              type="email"
              name="email"
              class="form-control"
              id="email"
              formControlName="email"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col">
            <label for="password">Password:</label>
            <input
              type="text"
              name="password"
              class="form-control"
              id="password"
              formControlName="password"
            />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="submit"
          class="btn"
          [ngClass]="user ? 'btn-primary' : 'btn-success'"
          [disabled]="!userForm.valid"
        >
          {{ user ? 'Update' : 'Save' }}
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
export class UserModalContent implements OnInit {
  @Input() user: User;

  userForm: FormGroup = new FormGroup({
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.minLength(5)]),
  });

  constructor(
    public activeModal: NgbActiveModal,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.userForm.setValue({
      username: this.user.username,
      email: this.user.email,
      password: null,
    });
    this.userForm.controls['username'].disable();
  }

  onSubmit() {
    const username =
      this.userForm.value.username === this.user.username
        ? null
        : this.userForm.value.username;

    const email =
      this.userForm.value.email === this.user.email
        ? null
        : this.userForm.value.email;

    const password = this.userForm.value.password;

    let user: User;
    if (this.user) {
      user = new User(username, 'user', email, password);
      this.usersService
        .updateUser(this.user.username, user)
        .subscribe(() => this.activeModal.close('Submit'));
    }
  }
}

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent implements OnInit {
  @Input() user: User;

  private _config: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    centered: true,
  };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  open() {
    const modalRef = this.modalService.open(UserModalContent, this._config);
    modalRef.componentInstance.user = this.user;
  }
}
