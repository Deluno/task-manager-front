import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FileModel } from '../models/file.model';
import { ApiEndpointsService } from './api-endpoints.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  filesUpdates$ = new Subject<boolean>();

  private _files: { [taskId: number]: FileModel[] } = {};

  constructor(private api: ApiEndpointsService) {}

  uploadFile(username: string, taskId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.api.postFile(username, taskId, formData).pipe(
      tap((file) => {
        if (!this._files[taskId]) this._files[taskId] = [];
        const fileModel = new FileModel(
          file.id,
          file.name,
          file.path,
          file.tid
        );
        this._files[taskId].push(fileModel);
        this.filesUpdates$.next(true);
      })
    );
  }

  preloadFiles(username: string, taskId: number) {
    return this.api.getFiles(username, taskId).pipe(
      tap((files) => {
        this._files[taskId] = [];
        for (const file of files) {
          this._files[taskId].push(file);
        }
        this.filesUpdates$.next(true);
      })
    );
  }

  getFilesForTask(taskId: number) {
    return this._files[taskId];
  }

  downloadFile(username: string, taskId: number, fileId: number) {
    return this.api.getFile(username, taskId, fileId);
  }

  deleteFile(username: string, taskId: number, fileId: number) {
    return this.api.deleteFile(username, taskId, fileId).pipe(
      tap(() => {
        const fileIndex = this._files[taskId].findIndex(
          (file) => file.id === fileId
        );
        this._files[taskId].splice(fileIndex, 1);
        this.filesUpdates$.next(true);
      })
    );
  }
}
