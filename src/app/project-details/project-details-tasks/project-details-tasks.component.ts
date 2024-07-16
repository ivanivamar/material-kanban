import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KanbanService} from "../../../shared/services/kanban-service.service";
import {ConfirmationService} from "primeng/api";
import {
    Subtasks,
    Task,
    Urgency,
    StatusList,
    UrgencyList, Project
} from 'src/app/interfaces/Kanban.interfaces';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-project-details-tasks',
    templateUrl: './project-details-tasks.component.html',
    styleUrls: ['./project-details-tasks.component.sass'],
    providers: [KanbanService, ConfirmationService]
})
export class ProjectDetailsTasksComponent implements OnInit {
    @Input() project: Project = new Project();
    @Input() users: any[] = [];
    @Output() onChanges = new EventEmitter();

    currentPageTasks: Task[] = [];
    loading = false;
    selectedTask: Task = new Task();

    statusList = StatusList;
    urgencyList: Urgency[] = UrgencyList;

    constructor(
        private kanbanService: KanbanService,
        private confirmService: ConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
        private _location: Location,
        private title: Title
    ) {
    }

    ngOnInit() {
        // Set the current page tasks to the project tasks max 10
        this.getCurrentPageTasks(1);
        // set task from url
        this.route.url.subscribe(async (url: any) => {
            if (url.length === 0) {
                await this.router.navigate(['']);
            } else if (url.length === 4 && url[2].path === 'tasks') {
                const taskId = url[3].path;
            }
        });
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

    async saveTaskChanges(task: Task) {
        let managedTask = JSON.parse(JSON.stringify(task)) as Task;
        managedTask.modificationDate = new Date().toString();
        this.project.tasks = this.project.tasks.map((task: Task) => task.id === managedTask.id ? managedTask : task);
        // update the project
        await this.kanbanService.updateProject(this.project);

        // update the current page tasks
        this.getCurrentPageTasks(1);
        this.onChanges.emit();

        // go to url and change new to id
        this._location.go('/projects/' + this.project.id + '/tasks/' + managedTask.id);
    }

    confirmDeleteTask(task: Task, event: any) {
        this.confirmService.confirm({
            target: event.target,
            message: 'Are you sure you want to delete this task?',
            icon: 'fa-duotone fa-triangle-exclamation',
            accept: () => {
                this.onTaskDelete({task});
            }
        });

    }

    onTaskDelete(task: any) {
        this.loading = true;
        // filter out the task
        this.project.tasks = this.project.tasks.filter((t: Task) => t.id !== task.id);
        // update the project
        this.kanbanService.updateProject(this.project);
        // update the current page tasks
        this.getCurrentPageTasks(1);
        this.selectedTask = new Task();
        this.onChanges.emit();
    }

    cancel() {
        this.selectedTask = new Task();
        // remove task from url
        this._location.go('/projects/' + this.project.id + '/tasks');
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
