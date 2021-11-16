import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', canActivate: [AuthGuard], component: TasksComponent },
  { path: 'calendar', canActivate: [AuthGuard], component: CalendarComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'auth',
    children: [
      { path: 'sign-in', component: AuthComponent },
      { path: 'sign-up', component: AuthComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
