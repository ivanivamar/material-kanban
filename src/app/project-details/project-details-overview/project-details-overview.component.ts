import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectDetails} from "../../../shared/helpers/projectClasses";
import {IDropdownOption, Task} from "../../interfaces/Kanban.interfaces";

interface CurrentWeekDays {
    label: string;
    day: number;
    tasks: Task[];
}

@Component({
    selector: 'app-project-details-overview',
    templateUrl: './project-details-overview.component.html',
    styleUrls: ['./project-details-overview.component.sass']
})
export class ProjectDetailsOverviewComponent implements OnInit {
    // @ts-ignore
    @Input() project: ProjectDetails;
    @Output() changeTab = new EventEmitter<number>();

    //task summary card:
    inProgressTasks: number = 0;
    completedTasks: number = 0;
    overdueTasks: number = 0;
    pendingTasks: number = 0;
    tasksSummaryOptions = {
        cutout: '80%',
        responsive: true,
        //hide legend
        plugins: {
            legend: {display: false},
        }
    };
    tasksSummaryData: any;

    //tasks over time card:
    tasksOverTimeOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {display: false},
        },
        scales: {
            x: {
                grid: {
                    color: '#F8F8FA',
                    tickBorderDash: [4, 4],
                },
                ticks: {
                    beginAtZero: true,
                }
            },
            y: {
                grid: {
                    tickBorderDash: [4, 4],
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                },
            }
        }
    };
    tasksOverTimeData: any;
    currentYearQuarterOptions: IDropdownOption[] = [
        {label: new Date().getFullYear().toString() + ' Q1', value: 1},
        {label: new Date().getFullYear().toString() + ' Q2', value: 2},
        {label: new Date().getFullYear().toString() + ' Q3', value: 3},
        {label: new Date().getFullYear().toString() + ' Q4', value: 4}
    ];
    selectedYearQuarter = this.currentYearQuarterOptions[0].value;

    // tasks this week card:
    currentWeekDays: CurrentWeekDays[] = [];
    isNextWeek: boolean = false;
    // @ts-ignore
    selectedDay: CurrentWeekDays;
    today = new Date();

    constructor() {
    }

    ngOnInit() {
        // select quarter based on current date
        let currentMonth = new Date().getMonth();
        if (currentMonth >= 0 && currentMonth <= 2) {
            this.selectedYearQuarter = 1;
        } else if (currentMonth >= 3 && currentMonth <= 5) {
            this.selectedYearQuarter = 2;
        } else if (currentMonth >= 6 && currentMonth <= 8) {
            this.selectedYearQuarter = 3;
        } else if (currentMonth >= 9 && currentMonth <= 11) {
            this.selectedYearQuarter = 4;
        }

        this.generateTasksSummaryData();
        this.generateTasksOverTimeData();
        this.generateCurrentWeekTasks();
    }

    // #region Tasks Summary
    generateTasksSummaryData() {
        this.inProgressTasks = this.getInProgressTasks();
        this.completedTasks = this.getCompletedTasks();
        this.overdueTasks = this.getOverdueTasks();
        this.pendingTasks = this.project.tasks.length - this.completedTasks - this.inProgressTasks - this.overdueTasks;

        this.tasksSummaryData = {
            labels: ['Active', 'Completed', 'Overdue', 'Yet to start'],
            datasets: [
                {
                    data: [this.inProgressTasks, this.completedTasks, this.overdueTasks, this.pendingTasks],
                    backgroundColor: ['#00A3FF', '#50CD89', '#F8285A', '#E4E6EF'],
                    hoverBackgroundColor: ['#00A3FF', '#50CD89', '#F8285A', '#E4E6EF'],
                }
            ]
        };
        console.log('%c Tasks Summary Data:', 'color: #00b33c', this.project)
    }

    getInProgressTasks() {
        // check if task is in progress
        let inProgressTasks = 0;
        if (this.project.tasks.length > 0) {
            this.project.tasks.filter(task => {
                if ((task.status.value == 1 && !task.completed) && !(task.dueDate < new Date().toString() && !task.completed)) {
                    inProgressTasks++;
                }
            });
        }
        return inProgressTasks;
    }

    getCompletedTasks() {
        // check if task is completed
        let completedTasks = 0;
        if (this.project.tasks.length > 0) {
            this.project.tasks.filter(task => {
                if (task.completed) {
                    completedTasks++;
                }
            });
        }
        return completedTasks;
    }

    getOverdueTasks() {
        // check if task.dueDate is before today
        let overdueTasks = 0;
        if (this.project.tasks.length > 0) {
            this.project.tasks.filter(task => {
                if (task.dueDate < new Date().toString() && !task.completed) {
                    overdueTasks++;
                }
            });
        }
        return overdueTasks;
    }

    // #endregion

    // #region Tasks Over Time
    generateTasksOverTimeData(newQuarterValue?: any) {
        if (newQuarterValue) {
            this.selectedYearQuarter = newQuarterValue;
        }

        let quarterStart = new Date();
        let quarterEnd = new Date();
        let labels: string[] = [];
        switch (this.selectedYearQuarter) {
            case 1:
                // January 1 - March 31
                quarterStart = new Date(new Date().getFullYear(), 0, 1);
                quarterEnd = new Date(new Date().getFullYear(), 2, 31);
                labels = ['Jan', 'Feb', 'Mar'];
                break;
            case 2:
                // April 1 - June 30
                quarterStart = new Date(new Date().getFullYear(), 3, 1);
                quarterEnd = new Date(new Date().getFullYear(), 5, 30);
                labels = ['Apr', 'May', 'Jun'];
                break;
            case 3:
                // July 1 - September 30
                quarterStart = new Date(new Date().getFullYear(), 6, 1);
                quarterEnd = new Date(new Date().getFullYear(), 8, 30);
                labels = ['Jul', 'Aug', 'Sep'];
                break;
            case 4:
                // October 1 - December 31
                quarterStart = new Date(new Date().getFullYear(), 9, 1);
                quarterEnd = new Date(new Date().getFullYear(), 11, 31);
                labels = ['Oct', 'Nov', 'Dec'];
                break;
        }

        let quarterTasksData = this.getQuarterTasks(quarterStart, quarterEnd);

        this.tasksOverTimeData = {
            labels: labels,
            datasets: [
                {
                    label: quarterTasksData[0].label,
                    data: quarterTasksData[0].data,
                    fill: true,
                    tension: 0.4,
                    borderColor: '#1B84FF',
                    backgroundColor: 'rgba(27, 132, 255, 0.2)',
                },
                {
                    label: quarterTasksData[1].label,
                    data: quarterTasksData[1].data,
                    fill: true,
                    tension: 0.4,
                    borderColor: '#17C653',
                    backgroundColor: 'rgba(49, 203, 105, 0.2)',
                }
            ]
        };
        console.log('%c Tasks Over Time Data:', 'color: #00b33c', this.tasksOverTimeData)
    }

    getQuarterTasks(quarterStart: Date, quarterEnd: Date): any {
        let quarterTasksData: [{ data: any[]; label: string }, { data: any[]; label: string }] = [
            {label: 'Incomplete', data: []},
            {label: 'Complete', data: []}
        ];
        this.project.tasks.filter(task => {
            let creationDate = new Date(task.creationDate);
            if ((creationDate >= quarterStart && creationDate <= quarterEnd)) {
                // get what of the three months the task was created
                let month = creationDate.getMonth();
                if (month == quarterStart.getMonth()) {
                    quarterTasksData[!task.completed ? 1 : 0].data[creationDate.getDate() - 1] = quarterTasksData[0].data[creationDate.getDate() - 1] ? quarterTasksData[0].data[creationDate.getDate() - 1] + 1 : 1;
                }
            }
        });
        return quarterTasksData;
    }

    // #endregion

    // #region Tasks This Week
    generateCurrentWeekTasks() {
        this.currentWeekDays = [];
        const today = new Date();
        const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        const monday = new Date(today);

        // If it's Saturday or Sunday, move to the next Monday
        if (currentDay === 6) { // Saturday
            monday.setDate(today.getDate() + 2);
            this.isNextWeek = true;
        } else if (currentDay === 0) { // Sunday
            monday.setDate(today.getDate() + 1);
            this.isNextWeek = true;
        } else {
            monday.setDate(today.getDate() - currentDay + 1);
            this.isNextWeek = false;
        }

        for (let i = 0; i < 5; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            this.currentWeekDays.push({
                label: day.toDateString().split(' ')[0].substring(0, 2),
                day: day.getDate(),
                tasks: this.getDayTasks(new Date(day)),
            });
        }
        // select current day from this.currentWeekDays
        this.selectedDay = this.currentWeekDays[currentDay - 1];

        console.log('%c Current Week Tasks:', 'color: #00b33c', this.currentWeekDays)
    }
    selectToday() {
        const today = new Date();
        const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        this.selectedDay = this.currentWeekDays[currentDay - 1];
    }

    getDayTasks(day: Date): Task[] {
        let dayTasks: Task[] = [];
        this.project.tasks.filter(task => {
            let taskDueDate = new Date(task.dueDate);
            if (taskDueDate.getDate() == day.getDate() && taskDueDate.getMonth() == day.getMonth() && taskDueDate.getFullYear() == day.getFullYear()) {
                dayTasks.push(task);
            }
        });
        // remove all but the first 3 tasks
        dayTasks = dayTasks.slice(0, 3);
        return dayTasks;
    }

    // #endregion
}
