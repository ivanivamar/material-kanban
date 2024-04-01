import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Subtasks, TaskDto, Urgency} from "../../../interfaces/Kanban.interfaces";
import {KanbanService} from "../../../../shared/services/kanban-service.service";
import {ConfirmationService} from "primeng/api";
import {StatusList, UrgencyList} from "../../../../shared/helpers/projectClasses";

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

    constructor(
        private kanbanService: KanbanService,
        private confirmService: ConfirmationService,
    ) {
    }

    onShow(task?: TaskDto) {
        if (task) {
            this.task = task;
        } else {
            this.task = new TaskDto();
        }
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
    }

    cancel() {
        this.task = null;
        this.onCancel.emit();
    }

    save() {
        this.onSave.emit(this.task);
        this.onCancel.emit();
    }

    confirmDeleteTask(event: any) {
        this.confirmService.confirm({
            target: event.event.target,
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
