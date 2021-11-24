import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    const date = new Date();
    this.currentYear = date.getFullYear();
    this.currentMonthNumber = date.getMonth();
    this.setCurrentMonth();
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

    const date = day.date;
    this.router.navigate(['../tasks'], {
      relativeTo: this.route,
      queryParams: {
        day: date.toISOString(),
      },
    });
  }

  private setCurrentMonth() {
    this.currentMonth = this.calendarService.getMonthName(
      this.currentMonthNumber
    );
  }
}
