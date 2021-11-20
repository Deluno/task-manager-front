import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';
import { TasksResolver } from './tasks/tasks-resolver.service';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/sign-in', pathMatch: 'full' },
  {
    path: 'users/:username/tasks',
    canActivate: [AuthGuard],
    resolve: { tasks: TasksResolver },
    component: TasksComponent,
  },
  {
    path: 'users/:username/calendar',
    canActivate: [AuthGuard],
    component: CalendarComponent,
  },
  { path: 'about', component: AboutComponent },
  {
    path: 'auth',
    children: [
      { path: 'sign-in', component: AuthComponent },
      { path: 'sign-up', component: AuthComponent },
    ],
  },
  { path: '**', redirectTo: '/tasks' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
