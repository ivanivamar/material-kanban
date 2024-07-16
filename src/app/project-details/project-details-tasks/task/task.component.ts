import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Project, StatusList, Subtasks, Task, Urgency, UrgencyList} from "../../../interfaces/Kanban.interfaces";
import {KanbanService} from "../../../../shared/services/kanban-service.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ActivatedRoute, Event, Router} from "@angular/router";

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.sass'],
    providers: [KanbanService, ConfirmationService]
})
export class TaskComponent implements OnInit {
    loading = false;
    project: Project = new Project();
    task: Task = new Task();

    constructor(
        private kanbanService: KanbanService,
        private confirmService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
    }

    async ngOnInit() {
        this.loading = true;
        // get project id from url
        this.route.url.subscribe(async (url: any) => {
            if (url.length === 0) {
                await this.router.navigate(['']);
            } else {
                const projectId = url[1].path;
                const taskId = url[3].path;

                // check if user is logged in
                this.project = await this.kanbanService.getProjectById(projectId);
                this.task = this.project.tasks.find((task: Task) => task.id === taskId) as Task;
                this.loading = false;
            }
        });
    }

    async toggleTaskCompletion() {
        this.task.completed = !this.task.completed;
        await this.updateProject();
    }

    addSubtask() {
        if (!this.task.subtasks) {
            this.task.subtasks = [];
        }
        this.task.subtasks.push({
            id: this.idGenerator(),
            title: '',
            description: '',
            checked: false
        });
    }

    removeSubtask(subtask: Subtasks) {
        if (this.task) {
            this.task.subtasks = this.task.subtasks.filter((checkbox: any) => checkbox.id !== subtask.id);
        }
    }

    confirmDeleteTask(event: any) {
        this.confirmService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete this task?',
            icon: 'fa-duotone fa-triangle-exclamation',
            accept: async () => {
                this.project.tasks = this.project.tasks.filter((task: Task) => task.id !== this.task.id);
                await this.updateProject();
                location.href = `/projects/${this.project.id}/tasks`;
            }
        });
    }

    async updateProject() {
        await this.kanbanService.updateProject(this.project);
        this.messageService.add({
            severity: 'success',
            summary: 'Task Updated',
            detail: 'Task completion status updated successfully'
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

    protected readonly StatusList = StatusList;
}
