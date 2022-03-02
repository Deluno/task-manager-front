import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FileModel } from '../models/file.model';

import { FilesService } from './files.service';
import { TasksService } from './tasks.service';

@Injectable({
  providedIn: 'root',
})
export class FilesResolver implements Resolve<FileModel[]> {
  constructor(
    private tasksService: TasksService,
    private filesService: FilesService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): FileModel[] | Observable<FileModel[]> | Promise<FileModel[]> {
    const username = route.parent.params['username'];
    const date = route.params['day'];

    const preloadedTasks = this.tasksService.getTasksOnDate(new Date(date));

    let loadedTasks = 0;
    for (const task of preloadedTasks) {
      this.filesService.preloadFiles(username, task.id).subscribe(() => {
        loadedTasks += 1;
      });
      if (loadedTasks === preloadedTasks.length) return;
    }
  }
}
