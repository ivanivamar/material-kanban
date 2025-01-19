import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {Task} from '../../../modules/project';
import {RippleDirective} from '../../shared/ripple.directive';
import {TaskModalComponent} from '../../shared/task-modal/task-modal.component';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {DatePipe} from '@angular/common';
import {MenuComponent, MenuItem} from '../../shared/menu/menu.component';
import {Timestamp} from 'firebase/firestore';
import {Paginator, PaginatorComponent} from '../../shared/paginator/paginator.component';
import {DropdownComponent, DropdownItem} from '../../shared/dropdown/dropdown.component';

@Component({
    selector: 'app-task-list',
    imports: [
        RippleDirective,
        TaskModalComponent,
        DatePipe,
        MenuComponent,
        PaginatorComponent,
        DropdownComponent
    ],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.sass'
})
export class TaskListComponent {
    @ViewChild(TaskModalComponent) taskModalComponent!: TaskModalComponent;
    @Output() onSave: EventEmitter<Task> = new EventEmitter();
    @Output() onDelete: EventEmitter<Task> = new EventEmitter();
    @Input() tasks: Task[] = [];

    private firebaseService = inject(FirebaseServiceService);

    selectedTask: Task = new Task();
    taskMenuItems: MenuItem[] = [
        { title: 'Edit', icon: 'edit', action: () => this.taskModalComponent.show(this.selectedTask) },
        { title: 'Delete', icon: 'delete', action: () => this.onDelete.emit(this.selectedTask) }
    ];
    orderBy: string = 'updatedAt';
    sortingOptions: DropdownItem[] = [
        { label: 'Name', value: 'name' },
        { label: 'Created at', value: 'createdAt' },
        { label: 'Updated at', value: 'updatedAt' },
        { label: 'Due date', value: 'dueDate' },
        { label: 'Status', value: 'status' }
    ];

    paginator: Paginator = {
        minIndex: 0,
        maxIndex: 0
    }

    public refreshTasks() {
        // order tasks by orderBy
        this.sortTasks();
    }

    sortTasks() {
        switch (this.orderBy) {
            case 'name':
                this.tasks.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'createdAt':
                this.tasks.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
                break;
            case 'updatedAt':
                this.tasks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
                break;
            case 'dueDate':
                this.tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
                break;
            case 'status':
                this.tasks.sort((a, b) => a.status.localeCompare(b.status));
                break;
            default:
                break;
        }
    }
}
