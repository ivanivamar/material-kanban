import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StatusList, Subtasks, TaskDto, Urgency, UrgencyList} from "../../../interfaces/Kanban.interfaces";
import {KanbanService} from "../../../../shared/services/kanban-service.service";
import {ConfirmationService} from "primeng/api";

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.sass'],
    providers: [KanbanService, ConfirmationService]
})
export class TaskComponent {
    @Input() task: TaskDto | null = null;
    @Input() members: any[] = [];

    @Output() onCancel = new EventEmitter();
    @Output() onSave = new EventEmitter();
    @Output() onDelete = new EventEmitter();

    statusList = StatusList;
    urgencyList: Urgency[] = UrgencyList;

    editTitle = false;
    previousTitle = '';

    editDescription = false;
    previousDescription = '';

    constructor(
        private kanbanService: KanbanService,
        private confirmService: ConfirmationService,
    ) {
    }

    editTitleToggle() {
        this.editTitle = true;
        this.previousTitle = JSON.parse(JSON.stringify(this.task?.title));
    }

    saveTitle() {
        this.editTitle = false;
        this.onSave.emit(this.task);
    }

    addSubtask() {
        if (this.task) {
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
    }

    removeSubtask(subtask: Subtasks) {
        if (this.task) {
            this.task.subtasks = this.task.subtasks.filter((checkbox: any) => checkbox.id !== subtask.id);
        }
        this.onSave.emit(this.task);
    }

    cancel() {
        this.task = null;
        this.onCancel.emit();
    }

    setCompleted() {
        if (this.task) {
            this.task.completed = true;
            this.onSave.emit(this.task);
        }
    }

    setNotCompleted() {
        if (this.task) {
            this.task.completed = false;
            this.onSave.emit(this.task);
        }
    }

    confirmDeleteTask(event: any) {
        this.confirmService.confirm({
            target: event.target,
            message: 'Are you sure you want to delete this task?',
            icon: 'fa-duotone fa-triangle-exclamation',
            accept: () => {
                this.onDelete.emit(this.task);
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
