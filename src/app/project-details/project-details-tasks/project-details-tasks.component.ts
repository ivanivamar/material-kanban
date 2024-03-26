import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectDetails} from "../../../shared/helpers/projectClasses";
import {KanbanService} from "../../../shared/services/kanban-service.service";
import {ConfirmationService} from "primeng/api";
import {Task, TaskDto} from 'src/app/interfaces/Kanban.interfaces';
import Swal from "sweetalert2";

@Component({
    selector: 'app-project-details-tasks',
    templateUrl: './project-details-tasks.component.html',
    styleUrls: ['./project-details-tasks.component.sass'],
    providers: [KanbanService, ConfirmationService]
})
export class ProjectDetailsTasksComponent implements OnInit {
    @Input() project: ProjectDetails = new ProjectDetails();
    @Output() onChanges = new EventEmitter();

    viewType = 'grid';
    currentPageTasks: Task[] = [];
    loading = false;
    selectedTask: TaskDto = new TaskDto();
    isManagingTask = false;

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

    manageTask(task?: Task) {
        this.selectedTask = task ? task : new TaskDto();
        this.selectedTask.owner = this.project.owner;
        this.isManagingTask = true;
    }

    saveTaskChanges() {
        console.log("this.selectedTask", this.selectedTask);
        let managedTask = JSON.parse(JSON.stringify(this.selectedTask)) as Task;
        if (managedTask.id) {
            // update the task
            this.project.tasks = this.project.tasks.map(task => task.id === managedTask.id ? managedTask : task);
        } else {
            // add the task
            managedTask.id = this.idGenerator();
            this.project.tasks.push(managedTask);
        }
        // update the project
        this.kanbanService.updateProject(this.project);
        Swal.fire({
            icon: 'success',
            title: 'Task saved successfully',
            confirmButtonText: 'Ok, got it!'
        });

        // update the current page tasks
        this.getCurrentPageTasks(1);
        this.isManagingTask = false;
        this.onChanges.emit();
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
                this.onChanges.emit();
            }
        });
    }

    idGenerator(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let autoId = '';
        for (let i = 0; i < 10; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return autoId;
    }
}
