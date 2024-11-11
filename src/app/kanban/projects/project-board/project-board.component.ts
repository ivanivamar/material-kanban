import {Component, Input} from '@angular/core';
import {FirebaseServiceService} from '../../../../services/firebase-service.service';
import {Column, Project, Task} from '../../../../modules/project';
import {MenuComponent} from '../../../shared/menu/menu.component';
import {CreateColumnComponent} from './create-column/create-column.component';
import {TaskComponent} from './task/task.component';
import {TaskModalComponent} from './task-modal/task-modal.component';
import {DragDropModule, CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';


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
    @Input() project: Project = new Project();

    createColumn = false;
    selectedColumn: Column = new Column();

    columnMenuItems = [
        {
            title: 'Create Task',
            icon: 'add',
            action: () => {
                this.createTask(this.selectedColumn);
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

    dropTask(event: CdkDragDrop<Task>, column: Column) {
        moveItemInArray(column.tasks, event.previousIndex, event.currentIndex);
        this.updateProject();
    }

    sortTasks() {
        this.project.columns.forEach(column => {
            column.tasks.sort((a, b) => {
                return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
            });
        });

        // get all tasks count
        const allTasks = this.project.columns.reduce((acc, column) => {
            return acc + column.tasks.length;
        }, 0);
        console.log('All tasks:', allTasks);
    }

    updateProject() {
        this.firebaseService.createProject(this.project);
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
