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
    weeks: Day[][] = [];

    selectedYear: number = new Date().getFullYear();
    selectedMonth: number = new Date().getMonth();
    selectedDay: number = new Date().getDate();
    selectedDate: Day = {day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear, isToday: true};

    showModal: boolean = false;
    isBottomPage: boolean = false;
    currentView: string = 'days';


    constructor(private _eref: ElementRef) {
    }

    onClick(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            // @ts-ignore
            if (event.target['classList'].contains('month') == false && event.target['classList'].contains('year') == false) {
                this.onClose();
            }
        } else {
            // check if the calendar is at the bottom of the page
            // @ts-ignore
            this.isBottomPage = window.innerHeight - event.clientY < 200;
        }
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

        this.generateCalendar();
    }

    generateCalendar() {
        const today = new Date();

        const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1);
        const lastDayOfMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0);
        const numDaysInMonth = lastDayOfMonth.getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

        // Calculate how many days to display from the previous month
        const daysFromPrevMonth = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);
        // Calculate total number of days to display including days from previous and next month
        const totalDaysToShow = daysFromPrevMonth + numDaysInMonth;
        // Calculate number of weeks needed
        const numWeeks = Math.ceil(totalDaysToShow / 7);
        this.weeks = [];

        let currentDay = 1 - daysFromPrevMonth;

        for (let i = 0; i < numWeeks; i++) {
            const week: Day[] = [];
            for (let j = 0; j < 7; j++) {
                const date = new Date(this.selectedYear, this.selectedMonth, currentDay);
                const dayOfMonth = date.getDate();
                const monthOfYear = date.getMonth();
                const year = date.getFullYear();
                const isToday = currentDay === today.getDate() && monthOfYear === today.getMonth() && year === today.getFullYear();

                week.push({ day: dayOfMonth, month: monthOfYear, year: year, isToday: isToday });

                currentDay++;
            }
            this.weeks.push(week);
        }
    }

    onYearSelected(year: number) {
        this.selectedYear = year;
        this.showModal = true;
        this.currentView = 'months';
    }

    onMonthSelected(month: number) {
        this.selectedMonth = month;
        this.showModal = true;
        this.generateCalendar();
        this.currentView = 'days';
    }

    onDaySelected(day: Day) {
        this.selectedDate = day;
        this.value = new Date(day.year, day.month, day.day).toString();
        this.valueChange.emit(this.value);
        this.showModal = false;
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

    setToday() {
        this.selectedYear = new Date().getFullYear();
        this.selectedMonth = new Date().getMonth();
        this.selectedDay = new Date().getDate();
        this.selectedDate = {day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear, isToday: true};
        this.value = new Date().toString();
        this.generateCalendar();
        this.valueChange.emit(this.value);
    }

    onClose() {
        this.showModal = false;
        this.currentView = 'days';
    }

}
