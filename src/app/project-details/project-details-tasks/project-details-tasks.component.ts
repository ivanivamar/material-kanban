import {Component, Input, OnInit} from '@angular/core';
import {ProjectDetails} from "../../../shared/helpers/projectClasses";
import {KanbanService} from "../../../shared/services/kanban-service.service";
import {ConfirmationService} from "primeng/api";
import { Task } from 'src/app/interfaces/Kanban.interfaces';

@Component({
    selector: 'app-project-details-tasks',
    templateUrl: './project-details-tasks.component.html',
    styleUrls: ['./project-details-tasks.component.sass'],
    providers: [KanbanService, ConfirmationService]
})
export class ProjectDetailsTasksComponent implements OnInit {
    @Input() project: ProjectDetails = new ProjectDetails();

    viewType = 'grid';
    currentPageTasks: Task[] = [];
    loading = false;

    constructor(
        private kanbanService: KanbanService,
        private confirmService: ConfirmationService
    ) {
    }

    ngOnInit() {
        // Set the current page tasks to the project tasks max 10
        this.getCurrentPageTasks(1);
    }

    getCurrentPageTasks(pageNumber: number) {
        this.loading = true;
        this.currentPageTasks = [];
        const offset = (pageNumber - 1) * 8;
        const endIndex = Math.min(offset + 8, this.project.tasks.length);

        for (let i = offset; i < endIndex; i++) {
            this.currentPageTasks.push(this.project.tasks[i]);
        }
        this.loading = false;
    }

    confirmDeleteTask(task: Task, event: any) {
        this.confirmService.confirm({
            target: event.target,
            message: 'Are you sure you want to delete this task?',
            icon: 'fa-duotone fa-triangle-exclamation',
            accept: () => {
                this.loading = true;
                // filter out the task
                this.project.tasks = this.project.tasks.filter(t => t.id !== task.id);
                // update the project
                this.kanbanService.updateProject(this.project);
                // update the current page tasks
                this.getCurrentPageTasks(1);
            }
        });
    }

}
