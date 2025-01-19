import {Component, Input} from '@angular/core';
import {Project, Status} from '../../../modules/project';
import {Card} from 'primeng/card';

@Component({
    selector: 'app-project-summary',
    imports: [
        Card
    ],
    templateUrl: './project-summary.component.html',
    styleUrl: './project-summary.component.css'
})
export class ProjectSummaryComponent {
    @Input() project: Project = new Project();


    getFinishedTasks(): number {
        return this.project.tasks.filter(task => task.status == Status.COMPLETED).length;
    }

    getUnfinishedTasks(): number {
        return this.project.tasks.filter(task => task.status != Status.COMPLETED).length;
    }

    getTasksWithDueDatePassed(): number {
        return this.project.tasks.filter(task => new Date(task.dueDate) < new Date()).length;
    }
}
