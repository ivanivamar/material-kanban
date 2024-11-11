import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FirebaseServiceService} from '../../../../services/firebase-service.service';
import {Column, Project, Task} from '../../../../modules/project';
import {MenuComponent} from '../../../shared/menu/menu.component';
import {CreateColumnComponent} from './create-column/create-column.component';
import {TaskComponent} from './task/task.component';
import {TaskModalComponent} from './task-modal/task-modal.component';
import {DragDropModule, CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


@Component({
    selector: 'app-project-board',
    standalone: true,
    imports: [
        MenuComponent,
        CreateColumnComponent,
        TaskComponent,
        TaskModalComponent,
        DragDropModule,
        CdkDropList,
        CdkDrag
    ],
    templateUrl: './project-board.component.html',
    styleUrl: './project-board.component.css',
    providers: [FirebaseServiceService]
})
export class ProjectBoardComponent {
    @ViewChild(TaskModalComponent) taskModal: TaskModalComponent | undefined;

    @Input() project: Project = new Project();
    @Output() refresh: EventEmitter<void> = new EventEmitter<void>();

    createColumn = false;
    selectedColumn: Column = new Column();

    columnMenuItems = [
        {
            title: 'Create Task',
            icon: 'add',
            action: () => {
                let task: Task = {
                    id: this.firebaseService.generateId(),
                    name: 'Title',
                    description: '',
                    completed: false,
                    dueDate: new Date(),
                    subtasks: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                this.taskModal?.show(task);
            }
        },
        {
            title: 'Delete Column',
            icon: 'delete',
            action: () => {
                this.deleteColumn();
            }
        }
    ];

    constructor(
        private firebaseService: FirebaseServiceService
    ) {
    }

    createTask(column: Column) {
        column.tasks.push({
            id: this.firebaseService.generateId(),
            name: 'Task',
            description: '',
            completed: false,
            dueDate: new Date(),
            subtasks: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.updateProject();
    }

    dropTask(event: CdkDragDrop<any[]>, column: Column) {
        if (event.previousContainer === event.container) {
            moveItemInArray(column.tasks, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                column.tasks,
                event.previousIndex,
                event.currentIndex
            );
        }
        this.updateProject();
    }

    sortTasks() {
        this.project.columns.forEach(column => {
            // by updatedAt
            column.tasks.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
        });
    }

    deleteTask(task: Task) {
        this.project.columns.forEach(column => {
            column.tasks = column.tasks.filter(t => t.id !== task.id);
        });

        this.updateProject();
    }

    updateProject(task?: Task) {
        if (task) {
            task.updatedAt = new Date();
            // check if task is in column
            let column = this.project.columns.find(c => c.tasks.find(t => t.id === task.id));
            if (column) {
                column.tasks = column.tasks.map(t => t.id === task.id ? task : t);
            } else {
                // add task to column
                this.selectedColumn.tasks.push(task);
            }
        }
        this.project.updatedAt = new Date();

        this.firebaseService.createProject(this.project);
        this.refresh.emit();
    }

    sortColumns(event: CdkDragDrop<Column[]>) {
        moveItemInArray(this.project.columns, event.previousIndex, event.currentIndex);

        this.updateProject();
    }

    deleteColumn() {
        this.project.columns = this.project.columns.filter(c => c.id !== this.selectedColumn.id);
        this.updateProject();
    }
}