import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  NgxBootstrapIconsModule,
  boxArrowInRight,
  blockquoteLeft,
  boxArrowLeft,
  justifyLeft,
  fileEarmark,
  plusSquare,
  calendar3,
  listTask,
  mailbox,
  plusLg,
  person,
  fonts,
  pen,
} from 'ngx-bootstrap-icons';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TasksComponent } from './users/tasks/tasks.component';
import { CalendarComponent } from './users/calendar/calendar.component';
import { AuthComponent } from './auth/auth.component';
import { PasswordsMatchValidatorDirective } from './shared/passwords-match-validator.directive';
import { AuthInterceptor } from './auth/services/auth-interceptor.service';
import { LoadingSpinnerComponent } from './shared/templates/loading-spinner/loading-spinner.component';
import { TaskComponent } from './users/tasks/task/task.component';
import {
  TaskModalComponent,
  TaskModalContent,
} from './users/tasks/task-modal/task-modal.component';
import { UsersComponent } from './users/users.component';
import { DashboardComponent } from './users/dashboard/dashboard.component';
import { UserComponent } from './users/dashboard/user/user.component';
import {
  UserModalComponent,
  UserModalContent,
} from './users/dashboard/user-modal/user-modal.component';

const icons = {
  boxArrowInRight,
  blockquoteLeft,
  boxArrowLeft,
  justifyLeft,
  fileEarmark,
  plusSquare,
  calendar3,
  listTask,
  mailbox,
  plusLg,
  person,
  fonts,
  pen,
};

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    TaskComponent,
    TasksComponent,
    HeaderComponent,
    TaskModalContent,
    UserModalContent,
    CalendarComponent,
    TaskModalComponent,
    LoadingSpinnerComponent,
    PasswordsMatchValidatorDirective,
    UsersComponent,
    DashboardComponent,
    UserComponent,
    UserModalComponent,
  ],
  imports: [
    NgbModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxBootstrapIconsModule.pick(icons, { width: '1.4em', height: '1.4em' }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
