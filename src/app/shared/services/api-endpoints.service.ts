import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TaskResponse {
  id: number;
  datetime: string;
  title: string;
  description: string;
  usr: string;
}

export interface UserResponse {
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiEndpointsService {
  constructor(private http: HttpClient) {}

  // Auth end-points
  signin(username: string, password: string) {
    return this.http.post<AuthResponse>(
      environment.taskManagerAPIPath + '/auth/login',
      { username, password }
    );
  }

  signup(username: string, email: string, password: string) {
    return this.http.post<AuthResponse>(
      environment.taskManagerAPIPath + '/auth/register',
      { username, email, password }
    );
  }

  refresh(refreshToken: string) {
    return this.http.post<AuthResponse>(
      environment.taskManagerAPIPath + '/auth/refresh',
      { refreshToken }
    );
  }

  // Users end-points
  getUsers() {
    return this.http
      .get<UserResponse[]>(`${environment.taskManagerAPIPath}/users`)
      .pipe(
        map((usersResponse) => {
          const users: User[] = [];
          for (const user of usersResponse) {
            users.push(new User(user.username, user.role, user.email));
          }
          return users;
        })
      );
  }

  getUser(username: string) {
    return this.http.get<UserResponse>(
      `${environment.taskManagerAPIPath}/users/${username}`
    );
  }

  patchUser(username: string, user: User) {
    let body = {};
    if (user.password) body['password'] = user.password;
    if (user.email) body['email'] = user.email;
    if (user.username) body['username'] = user.username;

    console.log(body);

    return this.http.patch<UserResponse>(
      `${environment.taskManagerAPIPath}/users/${username}`,
      body
    );
  }

  deleteUser(username: string) {
    return this.http.delete(
      `${environment.taskManagerAPIPath}/users/${username}`
    );
  }

  // Tasks end-points
  getTasks(username: string) {
    return this.http
      .get<TaskResponse[]>(
        `${environment.taskManagerAPIPath}/users/${username}/tasks`
      )
      .pipe(
        map((tasksRespose) => {
          const tasks: Task[] = [];
          for (const task of tasksRespose) {
            tasks.push(
              new Task(
                new Date(task.datetime),
                task.title,
                task.description,
                task.id,
                task.usr
              )
            );
          }
          return tasks;
        })
      );
  }

  getTask(username: string, taskId: number) {
    return this.http.get<TaskResponse>(
      `${environment.taskManagerAPIPath}/users/${username}/tasks/${taskId}`
    );
  }

  postTask(username: string, task: Task) {
    return this.http.post<TaskResponse>(
      `${environment.taskManagerAPIPath}/users/${username}/tasks`,
      {
        title: task.title,
        datetime: task.datetime,
        description: task.description,
      }
    );
  }

  patchTask(username: string, task: Task) {
    return this.http.patch(
      `${environment.taskManagerAPIPath}/users/${username}/tasks/${task.id}`,
      {
        title: task.title,
        datetime: task.datetime.toISOString(),
        description: task.description,
      }
    );
  }

  deleteTask(username: string, taskId: number) {
    return this.http.delete(
      `${environment.taskManagerAPIPath}/users/${username}/tasks/${taskId}`
    );
  }

  // Files end-points
  getFiles(username: string, taskId: number) {
    return this.http.get(
      `${environment.taskManagerAPIPath}/users/${username}/tasks/${taskId}/files`
    );
  }

  postFile(username: string, taskId: number, file: any) {
    return this.http.get(
      `${environment.taskManagerAPIPath}/users/${username}/tasks/${taskId}/files`
    );
  }
}
