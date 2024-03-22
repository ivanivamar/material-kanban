import { Component, Input, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { from } from 'rxjs';
import { Project, Task } from 'src/app/interfaces/Kanban.interfaces';
import { KanbanService } from 'src/shared/services/kanban-service.service';

@Component({
    selector: 'app-kanban-timeline',
    templateUrl: './kanban-timeline.component.html',
    styleUrls: ['./kanban-timeline.component.sass'],
    providers: [KanbanService, MessageService, ConfirmationService],
})
export class KanbanTimelineComponent implements OnInit {
    @Input() projectId: string | undefined;

    tasksList: Task[] = [];
    calendarOptions: any = [
        { label: 'Month', value: 'month' },
        { label: 'Week', value: 'week' },
        { label: 'Day', value: 'day' },
    ];
    currentView: string = 'week';

    // Week view:
    daysInWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    currentDay: number = new Date().getDate();
    currentMonthString: string = new Date().toLocaleString('default', { month: 'long' });
    currentYear: number = new Date().getFullYear();
    currentWeek: Week[] = [];
    timelineRows: any[] = [];

    constructor(
        private kanbanService: KanbanService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
    }

    ngOnInit(): void {
        if (this.projectId) {
            from(this.kanbanService.getProjectById(this.projectId)).subscribe((project: Project) => {
                project.tasks.forEach((task: Task) => {
                    this.tasksList.push(task);
                });
                this.currentWeek = this.getWeek(new Date());
                this.getTimelineRows();
            });
        }
    }

    getWeek(date: Date): Week[] {
        let week: Week[] = [];
        let day: Date = new Date(date.getTime());
        day.setDate(day.getDate() - day.getDay() + 1);

        for (let i = 0; i < 7; i++) {
            let dayTasks: Task[] = [];
            this.tasksList.forEach((task: Task) => {
                if (task.creationDate) {
                    let taskDate: Date = new Date(task.creationDate);
                    if (taskDate.getDate() === day.getDate() && taskDate.getMonth() === day.getMonth() && taskDate.getFullYear() === day.getFullYear()) {
                        dayTasks.push(task);
                    }
                }
            });

            week.push({
                day: this.daysInWeek[i],
                date: day.getDate(),
                month: day.getMonth(),
                year: day.getFullYear(),
                tasks: dayTasks,
            });

            day = new Date(day.getTime());
            day.setDate(day.getDate() + 1);
        }

        this.currentMonthString = new Date(week[0].year, week[0].month, week[0].date).toLocaleString('default', { month: 'long' });
        this.currentYear = new Date(week[0].year, week[0].month, week[0].date).getFullYear();

        return week;
    }

    getTimelineRows() {
        const timelineRow: Task[] = [];
        let previousTask: Task | undefined;
        for (const day of this.currentWeek) {
            for (const task of day.tasks) {
                // get length of the task like if due date is 2 days after creation date then length is 2
                const taskLength = Math.ceil((task.dueDate.getTime() - task.creationDate.getTime()) / (1000 * 3600 * 24));
                task.dayDuration = taskLength;
                if (previousTask === undefined) {
                    timelineRow.push(task);
                } else {
                    const previousTaskDay = previousTask.creationDate.getDay();
                    const taskDay = task.creationDate.getDay();
                    if (taskDay !== previousTaskDay) {
                        if (task.creationDate > previousTask.dueDate) {
                            timelineRow.push(task);
                        }
                    }
                }
                previousTask = task;
            }
        }
    }

    previousWeek(): void {
        let firstDay: Date = new Date(this.currentWeek[0].year, this.currentWeek[0].month, this.currentWeek[0].date);
        firstDay.setDate(firstDay.getDate() - 7);
        this.currentWeek = this.getWeek(firstDay);
    }

    nextWeek(): void {
        let firstDay: Date = new Date(this.currentWeek[0].year, this.currentWeek[0].month, this.currentWeek[0].date);
        firstDay.setDate(firstDay.getDate() + 7);
        this.currentWeek = this.getWeek(firstDay);
    }

    getCurrentWeek(): void {
        this.currentWeek = this.getWeek(new Date());
    }

    toCapitalCase(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}

export interface Week {
    day: string;
    date: number;
    month: number;
    year: number;
    tasks: Task[];
}
