import {Component, inject, Input, OnInit} from '@angular/core';
import {Project, Status} from '../../../modules/project';
import {Card} from 'primeng/card';
import {NavigationService} from '../../../services/navigation.service';

@Component({
    selector: 'app-project-summary',
    imports: [
        Card
    ],
    templateUrl: './project-summary.component.html',
    styleUrl: './project-summary.component.css'
})
export class ProjectSummaryComponent implements OnInit {
    private navigationService = inject(NavigationService);

    project: Project = new Project();

    ngOnInit() {
        this.navigationService.currentSelectedProject.subscribe(project => {
            this.project = project;
        });
    }

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
