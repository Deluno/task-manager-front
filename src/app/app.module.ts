import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  NgxBootstrapIconsModule,
  boxArrowLeft,
  plusSquare,
  boxArrowInRight,
  calendar3,
  listTask,
  blockquoteLeft,
} from 'ngx-bootstrap-icons';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TasksComponent } from './tasks/tasks.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AboutComponent } from './about/about.component';
import { AuthComponent } from './auth/auth.component';
import { PasswordsMatchValidatorDirective } from './shared/passwords-match-validator.directive';
import { AuthInterceptor } from './auth/auth-interceptor.service';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

const icons = {
  boxArrowInRight,
  boxArrowLeft,
  calendar3,
  listTask,
  blockquoteLeft,
  plusSquare,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TasksComponent,
    CalendarComponent,
    AboutComponent,
    AuthComponent,
    PasswordsMatchValidatorDirective,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
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
