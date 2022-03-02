import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FileModel } from 'src/app/shared/models/file.model';
import { Task } from 'src/app/shared/models/task.model';
import { FilesService } from 'src/app/shared/services/files.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  files: FileModel[];

  private _filesUpdatesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private filesService: FilesService
  ) {}

  ngOnInit(): void {
    this.files = this.filesService.getFilesForTask(this.task.id);
    this._filesUpdatesSub = this.filesService.filesUpdates$.subscribe(() => {
      this.files = this.filesService.getFilesForTask(this.task.id);
    });
  }

  onDelete() {
    const username = this.route.snapshot.parent.params['username'];
    this.tasksService.deleteTask(username, this.task.id).subscribe();
  }

  onFileClick(file: FileModel) {
    const username = this.route.snapshot.parent.params['username'];
    console.log('data');
    return this.filesService
      .downloadFile(username, this.task.id, file.id)
      .subscribe((data) => {
        const resBlob = new Blob([data]);

        const downloadURL = window.URL.createObjectURL(resBlob);
        const link = document.createElement('a');

        link.href = downloadURL;
        link.download = file.name;
        link.click();
      });
  }

  onFileDelete(file: FileModel) {
    const username = this.route.snapshot.parent.params['username'];
    return this.filesService
      .deleteFile(username, this.task.id, file.id)
      .subscribe();
  }

  ngOnDestroy() {
    this._filesUpdatesSub.unsubscribe();
  }
}
