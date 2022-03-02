export class Task {
  constructor(
    public datetime: Date,
    public title: string,
    public description: string,
    private _id?: number,
    public usr?: string,
    private _files?: []
  ) {}

  get id() {
    return this._id;
  }

  get files() {
    return this._files?.slice();
  }

  get time(): string {
    const minutes = this.datetime.getMinutes();
    const hours = this.datetime.getHours();
    return `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;
  }
}
