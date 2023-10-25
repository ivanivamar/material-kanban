import { Component, ElementRef, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from 'src/app/app-component-base';
import { IDropdownOption } from 'src/app/interfaces/Kanban.interfaces';

@Component({
	selector: 'mat-datepicker',
	templateUrl: './mat-datepicker.component.html',
	styleUrls: ['./mat-datepicker.component.sass'],
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class MatDatepickerComponent extends AppComponentBase implements OnInit {
	@Input() label: string = '';
	@Input() placeholder: string = '';
	@Input() icon: string = '';
	@Input() value: any = '';
	@Input() minDate: Date | string = '';
	@Input() maxDate: Date | string = '';
	@Input() required: boolean = false;
	@Input() disabled: boolean = false;
	@Input() readonly: boolean = false;

	active = false;

	daysArray: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	monthArray: string[] = [
		'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
		'September', 'October', 'November', 'December'
	];
	monthArrayOptions: IDropdownOption[] = [
		{ value: 'January', label: 'January' },
		{ value: 'February', label: 'February' },
		{ value: 'March', label: 'March' },
		{ value: 'April', label: 'April' },
		{ value: 'May', label: 'May' },
		{ value: 'June', label: 'June' },
		{ value: 'July', label: 'July' },
		{ value: 'August', label: 'August' },
		{ value: 'September', label: 'September' },
		{ value: 'October', label: 'October' },
		{ value: 'November', label: 'November' },
		{ value: 'December', label: 'December' }
	];
	monthDaysArray: MonthDays[] = [];
	currentMonth: string = '';
	emptySpaceInMonth = 0;
	emptySpaceInMonthArray: number[] = [];
	currentYear = new Date().getFullYear();

	constructor(
		injector: Injector,
		private _eref: ElementRef
	) { 
		super(injector);
	}

	ngOnInit(): void {
		if (!this.isStringNullOrEmpty(this.value.toString())) {
			this.value = new Date(this.value.seconds * 1000 + Math.floor(this.value.nanoseconds / 1e6));
			// Get current month:
			const date = new Date(this.value);
			console.log("Date: ", date);
			const currentMonth = new Date(date).getMonth();
			this.currentMonth = this.monthArray[currentMonth];
		} else {
			// Get current month:
			const date = new Date();
			const currentMonth = date.getMonth();
			this.currentMonth = this.monthArray[currentMonth];
		}
		if (!this.isStringNullOrEmpty(this.minDate.toString())) {
			this.minDate = new Date(this.minDate);
		}
		if (!this.isStringNullOrEmpty(this.maxDate.toString())) {
			this.maxDate = new Date(this.maxDate);
		}

		this.getMonthDays();
		console.log("Month days: ", this.monthDaysArray);
	}

	// Month navigation
	selectMonth(month: string): void {
		this.getMonthDays();
	}
	getMonthDays(): void {
		console.log("currentMonth: ", this.currentMonth);
		this.monthDaysArray = [];

		// new date with month == currentMonth
		const date = new Date(`${this.currentMonth} 1, ${this.currentYear}`);
		const currentMonth = date.getMonth();
		const currentYear = date.getFullYear();
		const totalDays: number = new Date(currentYear, currentMonth+1, 0).getDate();

		// loop through total days and add to array
		for (let i = 1; i <= totalDays; i++) {
			this.monthDaysArray.push({
				day: i,
				correspondingWeekDay: new Date(currentYear, currentMonth, i).getDay()
			});
		}
		var now = new Date();
		this.emptySpaceInMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDay();
		this.emptySpaceInMonthArray = [];
		// fill this.emptySpaceInMonthArray
		for (let i = 0; i < this.emptySpaceInMonth; i++) {
			this.emptySpaceInMonthArray.push(i);
		}
	}

	getPreviousMonthDays(): void {
		this.currentMonth = this.monthArray[this.monthArray.indexOf(this.currentMonth)-1];
		
		this.getMonthDays();
	}
	getNextMonthDays(): void {
		this.currentMonth = this.monthArray[this.monthArray.indexOf(this.currentMonth)+1];
		
		this.getMonthDays();
	}

	checkIfDayCorrespondsToIndex(day: MonthDays, index: number): boolean {
		// first make index always be from 0 to 6
		if (index > 6) {
			index = index - 7;
		}

		return day.correspondingWeekDay === index;
	}

	// Date selection
	selectDate(day: number): void {
		const date = new Date();
		const currentMonth = date.getMonth();
		const currentYear = date.getFullYear();
		const selectedDate = new Date(currentYear, currentMonth, day);

		this.value = selectedDate;
	}

	// Date formatting
	formatDate(date: Date): string {
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	// Date validation
	isDateValid(date: Date): boolean {
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();

		const daysInMonth = new Date(year, month, 0).getDate();

		if (day > daysInMonth) {
			return false;
		}
		return true;
	}

	onClick(event: Event) {
		if (!this._eref.nativeElement.contains(event.target)) {
			this.active = false;
		}
	}
}

export interface MonthDays {
	day: number;
	correspondingWeekDay: number;
}
