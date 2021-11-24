import { Injectable } from '@angular/core';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { Day } from './day.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private _months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  private _weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  constructor(private tasksService: TasksService) {}

  getMonthName(monthNumber: number) {
    return this._months[monthNumber];
  }

  getMonths() {
    return this._months.slice();
  }

  getWeekDays() {
    return this._weekDays.slice();
  }

  getDaysList(year: number, month: number): Day[] {
    const now = new Date();
    const d = new Date(year, month + 1, 0);
    const pd = new Date(year, month, 0);
    const totalDays = 42;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return Array.from({ length: totalDays }, (_, i) => {
      const dayNum = i + pd.getDate() - pd.getDay() + 1;
      const date = new Date(year, month - 1, dayNum);
      const isActive = date.getMonth() === d.getMonth();
      const isToday = date.getTime() == today.getTime();
      const hasTasks = this.tasksService.hasTasksOnDate(date);
      return new Day(date, isActive, hasTasks, isToday);
    });
  }
}
