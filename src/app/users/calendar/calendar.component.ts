import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/shared/models/task.model';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { CalendarService } from './calendar.service';
import { Day } from './day.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  currentYear: number;
  currentMonth: string;
  currentMonthNumber: number;

  constructor(
    private calendarService: CalendarService,
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private vps: ViewportScroller,
    private router: Router
  ) {}

  public get months() {
    return this.calendarService.getMonths();
  }

  public get weekDays() {
    return this.calendarService.getWeekDays();
  }

  public get currentMonthDays(): Day[] {
    return this.calendarService.getDaysList(
      this.currentYear,
      this.currentMonthNumber
    );
  }

  public get todayTasks(): Task[] {
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return this.tasksService.getTasksOnDate(today);
  }

  ngOnInit(): void {
    const date = new Date();
    this.currentYear = date.getFullYear();
    this.currentMonthNumber = date.getMonth();
    this.setCurrentMonth();
    this.setCurrentDay();
  }

  onMonthChange() {
    this.setCurrentMonth();
  }

  onNextMonth() {
    let nextMonth = this.currentMonthNumber + 1;
    if (nextMonth >= 12) {
      nextMonth = 0;
      this.currentYear++;
    }
    this.currentMonthNumber = nextMonth;
    this.setCurrentMonth();
  }

  onPrevMonth() {
    let prevMonth = this.currentMonthNumber - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
      this.currentYear--;
    }
    this.currentMonthNumber = prevMonth;
    this.setCurrentMonth();
  }

  onYearChange() {
    this.setCurrentMonth();
  }

  onSelectDay(day: Day) {
    if (!day.isActive) return;

    this.vps.scrollToAnchor('tasks');
    const date = day.date;
    this.router.navigate([date.toISOString()], { relativeTo: this.route });
  }

  private setCurrentMonth() {
    this.currentMonth = this.calendarService.getMonthName(
      this.currentMonthNumber
    );
  }

  private setCurrentDay() {
    const today = this.calendarService.getTodayDate();
    this.router.navigate([today.toISOString()], { relativeTo: this.route });
  }
}
