export class Day {
  constructor(
    public date: Date,
    public active: boolean,
    public hasTasks: boolean
  ) {}

  toString() {
    return this.date.getDate();
  }
}
