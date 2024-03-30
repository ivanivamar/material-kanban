import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

interface Day {
    day: number;
    month: number;
    year: number;
    isToday: boolean;
}

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'mat-calendar',
    templateUrl: './mat-calendar.component.html',
    styleUrls: ['./mat-calendar.component.sass']
})
export class MatCalendarComponent implements OnInit {
    @Input() value: string = '';
    @Input() range: boolean = false;
    @Input() placeholder: string = 'Select a date';
    @Input() disabled: boolean = false;
    @Input() required: boolean = false;

    @Output() valueChange = new EventEmitter<string>();

    days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    weeks: any[] = [];

    selectedYear: number = new Date().getFullYear();
    selectedMonth: number = new Date().getMonth();
    selectedDay: number = new Date().getDate();
    selectedDate: Day = {day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear, isToday: true};

    showModal: boolean = false;
    isBottomPage: boolean = false;
    currentView: string = 'days';


    constructor(private _eref: ElementRef) {
    }

    ngOnInit(): void {
        if (this.value.length === 0) {
            this.value = new Date().toString();
            this.selectedYear = new Date().getFullYear();
            this.selectedMonth = new Date().getMonth();
            this.selectedDay = new Date().getDate();
            this.selectedDate = {day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear, isToday: true};
        } else {
            this.selectedYear = new Date(this.value).getFullYear();
            this.selectedMonth = new Date(this.value).getMonth();
            this.selectedDay = new Date(this.value).getDate();
            let isToday = this.selectedYear === new Date().getFullYear() && this.selectedMonth === new Date().getMonth() && this.selectedDay === new Date().getDate();
            this.selectedDate = {day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear, isToday: isToday};
        }
        console.log("%c selectedDate", "color: green; font-size: 16px; font-weight: bold;", this.selectedDate);

        this.generateCalendar();
    }

    generateCalendar() {
        this.weeks = [];
        const firstDay = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
        const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
        const lastMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
        const weeks = Math.ceil((lastDay + firstDay) / 7);

        let day = 1;
        for (let i = 0; i < weeks; i++) {
            let week: Day[] = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    week.push({ day: lastMonth - firstDay + j + 1, month: this.selectedMonth - 1, year: this.selectedYear, isToday: false });
                } else if (day > lastDay) {
                    week.push({ day: day - lastDay, month: this.selectedMonth + 1, year: this.selectedYear, isToday: false });
                } else {
                    let isToday = this.selectedYear === new Date().getFullYear() && this.selectedMonth === new Date().getMonth() && day === new Date().getDate();
                    week.push({ day: day, month: this.selectedMonth, year: this.selectedYear, isToday: isToday });
                }
                day++; // Increment day in each iteration
            }
            this.weeks.push(week);
        }
    }

    onClick(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.showModal = false;
        }
    }

    onYearSelected(year: number) {
        this.selectedYear = year;
        this.currentView = 'months';
    }

    onMonthSelected(month: number) {
        this.selectedMonth = month;
        this.currentView = 'days';
    }

    onDaySelected(day: any) {
        this.selectedDate = day;
        this.value = new Date(this.selectedYear, this.selectedMonth, this.selectedDate.day).toString();
        this.valueChange.emit(this.value);
        this.showModal = false;
    }
    isSelectedDay(day: any) {
        return this.selectedDate.day === day.day && this.selectedDate.month === day.currentMonth && this.selectedDate.year === day.currentYear;
    }

    onViewChange(view: string) {
        this.currentView = view;
    }

    onPrev() {
        if (this.currentView === 'days') {
            this.selectedMonth--;
            if (this.selectedMonth < 0) {
                this.selectedMonth = 11;
                this.selectedYear--;
            }
        } else if (this.currentView === 'years') {
            this.selectedYear -= 12;
        }

        // set weeks to current month
        this.generateCalendar();
    }

    onNext() {
        if (this.currentView === 'days') {
            this.selectedMonth++;
            if (this.selectedMonth > 11) {
                this.selectedMonth = 0;
                this.selectedYear++;
            }
        } else if (this.currentView === 'years') {
            this.selectedYear += 12;
        }
        this.generateCalendar();
    }

}
