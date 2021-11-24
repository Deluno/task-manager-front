export class Day {
  constructor(
    public date: Date,
    public isActive: boolean,
    public hasTasks: boolean,
    public isToday?: boolean
  ) {}

  toString() {
    return this.date.getDate();
  }
}
