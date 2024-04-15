import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Activity, Subtasks, TaskDto, Urgency} from "../../../interfaces/Kanban.interfaces";
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

    editTitle = false;
    previousTitle = '';

    editDescription = false;
    previousDescription = '';

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

    editTitleToggle() {
        this.editTitle = true;
        this.previousTitle = JSON.parse(JSON.stringify(this.task?.title));
    }

    addActivity(type: string) {
        if (this.task !== null) {
            let newActivity: Activity;
            if (this.task.activity === undefined) {
                this.task.activity = [];
            }
            switch (type) {
                case 'editTitle':
                    newActivity = {
                        icon: 'fa-duotone fa-pencil',
                        user: this.task.owner,
                        action: "changed the title from <del>" + this.previousTitle + "</del> to " + this.task.title,
                        date: new Date().toString()
                    };
                    this.task.activity.push(newActivity);
                    break;
                case 'editAssignee':
                    newActivity = {
                        icon: 'fa-duotone fa-user',
                        user: this.task.owner,
                        action: "assigned the task to " + this.task.assignees.username,
                        date: new Date().toString()
                    };
                    this.task.activity.push(newActivity);
                    break;
                case 'editUrgency':
                    newActivity = {
                        icon: 'fa-duotone fa-exclamation',
                        user: this.task.owner,
                        action: "changed the urgency to " + this.task.urgency.title,
                        date: new Date().toString()
                    };
                    this.task.activity.push(newActivity);
                    break;
                case 'editStatus':
                    newActivity = {
                        icon: 'fa-duotone fa-circle',
                        user: this.task.owner,
                        action: "changed the status to " + this.task.status.name,
                        date: new Date().toString()
                    };
                    this.task.activity.push(newActivity);
                    break;
                case 'editDueDate':
                    newActivity = {
                        icon: 'fa-duotone fa-calendar',
                        user: this.task.owner,
                        action: "changed the due date to " + this.task.dueDate,
                        date: new Date().toString()
                    };
                    this.task.activity.push(newActivity);
                    break;
            }
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

    setCompleted() {
        if (this.task) {
            this.task.completed = true;
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
