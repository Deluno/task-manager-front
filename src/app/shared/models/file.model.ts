export class FileModel {
  constructor(
    public id: number,
    public name: string,
    public path: string,
    public taskId: number
  ) {}
}
