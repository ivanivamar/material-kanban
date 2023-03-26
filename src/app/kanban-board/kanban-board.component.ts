import { Checkboxes, Column, Labels, Project, Urgency } from './../interfaces/Kanban.interfaces';
import { ProjectWithId, Task } from '../interfaces/Kanban.interfaces';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    Firestore,
    collectionData,
    collection,
    addDoc,
    deleteDoc,
    doc,
    DocumentData,
    updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-kanban-board',
    templateUrl: './kanban-board.component.html',
    styleUrls: ['./kanban-board.component.sass'],
    providers: []
})
export class KanbanBoardComponent implements OnInit {
    projects: any[] = [];
    project: ProjectWithId = {} as ProjectWithId;
    projectId: string = '';
    loading: boolean = false;

    showAddColumnModal: boolean = false;
    columnTitle: string = '';

    showEditColumnModal: boolean = false;
    columnEditId: string = '';
    columnEditTitle: string = '';

    showAddTaskModal: boolean = false;
    taskColumnId: string = '';
    selectedTask: Task = {} as Task;

    labelsList = [
        { name: 'Frontend', color: '#F8D4C7', code: 'frontend' },
        { name: 'TS', color: '#FFE8BC', code: 'ts' },
        { name: 'Translations', color: '#E5C7F5', code: 'translations' },
        { name: 'Bugfix', color: '#FFF9EB', code: 'bugfix' },
    ];
    urgencyList: Urgency[] = [
        { title: 'Low', code: 0, color: '#F8D4C7' },
        { title: 'Medium', code: 1, color: '#FFE8BC' },
        { title: 'High', code: 2, color: '#E5C7F5' },
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private firestore: Firestore) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params == null || params['projectId'] == null) {
                this.router.navigate(['/dashboard']);
            } else {
                this.loading = true;
                this.projectId = params['projectId'];
                this.getProjects().subscribe((projects: ProjectWithId[]) => {
                    console.log(projects);
                    this.projects = projects;
                    this.project = this.projects.find((project: ProjectWithId) => project.id === this.projectId);
                    console.log('%c Project: ', 'background: #222; color: #bada55', this.project);
                    this.loading = false;
                });
            }
        });
    }

    editColumnSetup(columnId: string, columnTitle: string) {
        this.columnEditId = columnId;
        this.columnEditTitle = columnTitle;
        this.showEditColumnModal = true;
    }

    addTaskSetup(columnId: string) {
        this.taskColumnId = columnId;
        this.showAddTaskModal = true;
    }

    editTaskSetup(columnId: string, task: Task) {
        this.taskColumnId = columnId;
        this.selectedTask = task;
        this.showAddTaskModal = true;
    }

    //#region Getters
    getProjects(): Observable<ProjectWithId[]> {
        const projectRef = collection(this.firestore, 'projects');
        return collectionData(projectRef, { idField: 'id' }) as Observable<
            ProjectWithId[]
        >;
    }
    //#endregion

    //#region Setters
    async addColumn() {
        this.loading = true;
        const projectRef = doc(this.firestore, 'projects', this.projectId);
        await updateDoc(projectRef, {
            columns: [
                ...this.project.columns,
                {
                    id: this.idGenerator(),
                    title: this.columnTitle,
                    tasks: [],
                },
            ],
        });
        this.loading = false;
        this.showAddColumnModal = false;
    }

    async editColumn() {
        this.loading = true;
        const projectRef = doc(this.firestore, 'projects', this.projectId);
        await updateDoc(projectRef, {
            columns: this.project.columns.map((column: any) => {
                if (column.id === this.columnEditId) {
                    column.title = this.columnEditTitle;
                }
                return column;
            }),
        });
        this.loading = false;
        this.showEditColumnModal = false;
    }

    async addTask() {
        this.loading = true;
        const projectRef = doc(this.firestore, 'projects', this.projectId);
        console.log(this.taskColumnId);
        if (this.selectedTask.id === '' || this.selectedTask.id == null || this.selectedTask.id === undefined) {
            await updateDoc(projectRef, {
                columns: this.project.columns.map((column: any) => {
                    if (column.id === this.taskColumnId) {
                        column.tasks = [
                            ...column.tasks,
                            {
                                id: this.idGenerator(),
                                title: this.selectedTask.title ? this.selectedTask.title : '',
                                description: this.selectedTask.description ? this.selectedTask.description : '',
                                urgency: this.selectedTask.urgency ? this.selectedTask.urgency : null,
                                labels: this.selectedTask.labels ? this.selectedTask.labels : [],
                                checkboxes: this.selectedTask.checkboxes ? this.selectedTask.checkboxes : [],
                                creationDate: new Date(),
                            },
                        ];
                    }
                    return column;
                }),
            });
        } else {
            await updateDoc(projectRef, {
                columns: this.project.columns.map((column: any) => {
                    if (column.id === this.taskColumnId) {
                        column.tasks = column.tasks.map((task: any) => {
                            if (task.id === this.selectedTask.id) {
                                task.title = this.selectedTask.title ? this.selectedTask.title : '';
                                task.description = this.selectedTask.description ? this.selectedTask.description : '';
                                task.urgency = this.selectedTask.urgency ? this.selectedTask.urgency : null;
                                task.labels = this.selectedTask.labels ? this.selectedTask.labels : [];
                                task.checkboxes = this.selectedTask.checkboxes ? this.selectedTask.checkboxes : [];
                            }
                            return task;
                        });
                    }
                    return column;
                }),
            });
        }
        this.loading = false;
        this.clearTask();
    }

    //#endregion

    //#region Deleters
    async deleteColumn(projectId: string, columnId: string) {
        this.loading = true;
        const projectRef = doc(this.firestore, 'projects', projectId);
        await updateDoc(projectRef, {
            columns: this.project.columns.filter((column: any) => column.id !== columnId)
        });
        this.loading = false;
    }

    async deleteTask(projectId: string, columnId: string, taskId: string) {
        this.loading = true;
        const projectRef = doc(this.firestore, 'projects', projectId);
        await updateDoc(projectRef, {
            columns: this.project.columns.map((column: any) => {
                if (column.id === columnId) {
                    column.tasks = column.tasks.filter((task: any) => task.id !== taskId);
                }
                return column;
            })
        });
        this.loading = false;
    }
    //#endregion


    //#region Helpers
    async onTaskColumnEdit(event: any) {
        console.log(event);
        // Find the old and new columns
        const oldColumn = this.project.columns.find(c => c.tasks.includes(this.selectedTask)) as Column;
        const newColumn = this.project.columns.find(c => c.id === event.value) as Column;

        // If the task is already in the new column, do nothing
        if (oldColumn === newColumn) {
            return;
        }

        // Remove the task from the old column
        const index = oldColumn.tasks.indexOf(this.selectedTask);
        console.log(index);
        if (index > -1) {
            oldColumn.tasks.splice(index, 1);
        }

        // Add the task to the new column
        newColumn.tasks.push(this.selectedTask);

        // Update the Firestore document
        updateDoc(doc(this.firestore, 'projects', this.projectId), {
            columns: this.project.columns.map((column: any) => {
                return column;
            }
        )});
    }

    onDrop(event: CdkDragDrop<Task[]>) {
        console.log(event);
        // move the task from its old column to its new column
        moveItemInArray(event.previousContainer.data, event.previousIndex, event.currentIndex);
        // update the database
        this.editColumnOnDrag(this.project);
    }

    getConnectedLists(columnId: string): string[] {
        // return the ids of all the other columns that aren't this one
        return this.project.columns.filter(c => c.id !== columnId).map(c => 'column-' + c.id);
    }

    private async editColumnOnDrag(project: ProjectWithId) {
        this.loading = true;
        const projectRef = doc(this.firestore, 'projects', project.id);
        await updateDoc(projectRef, {
            columns: project.columns.map((column: any) => {
                return column;
            }),
        });
        this.loading = false;
    }

    clearTask() {
        this.taskColumnId = '';
        this.selectedTask = {} as Task;
        this.showAddTaskModal = false;
    }

    private idGenerator(): string {
        // letters + numbers
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let autoId = '';
        for (let i = 0; i < 20; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return autoId;
    }

    private isEmpty(obj: any) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    }

    private isInvalidInput(input: any): boolean {
        // check for string
        switch (typeof input) {
            case 'string':
                if (input.length === 0 || input === '' || input === null || input === undefined) {
                    return true;
                }
                break;
            case 'number':
                if (isNaN(input) || input === null || input === undefined) {
                    return true;
                }
                break;
            case 'boolean':
                if (input === null) {
                    return true;
                }
                break;
            case 'undefined':
                return true;
            case 'object':
                if (this.isEmpty(input)) {
                    return true;
                }
                break;
            default:
                return true;
        }
        return false;
    }
    //#endregion
}
