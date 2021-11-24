import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { CalendarComponent } from './users/calendar/calendar.component';
import { TasksResolver } from './shared/services/tasks-resolver.service';
import { TasksComponent } from './users/tasks/tasks.component';
import { DashboardComponent } from './users/dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UsersResolver } from './users/dashboard/users-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: '/auth/sign-in', pathMatch: 'full' },
  {
    path: 'users',
    component: UsersComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: [UsersResolver],
      },
      {
        path: ':username/tasks',
        canActivate: [AuthGuard],
        component: TasksComponent,
        resolve: [TasksResolver],
      },
      {
        path: ':username/calendar',
        canActivate: [AuthGuard],
        component: CalendarComponent,
        resolve: [TasksResolver],
      },
    ],
  },
  {
    path: 'auth',
    children: [
      { path: 'sign-in', component: AuthComponent },
      { path: 'sign-up', component: AuthComponent },
    ],
  },
  { path: '**', redirectTo: '/auth/sign-in' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
