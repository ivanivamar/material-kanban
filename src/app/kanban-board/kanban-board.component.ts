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
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

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
    newCheckbox: string = '';

    showCheckboxes: string = '';

    labelsList = [
        { name: 'FRONTEND', color: '#2E7DFF', background: '#F2F7FD', code: 'frontend' },
        { name: 'TS', color: '#FDAF1B', background: '#FFFBF2', code: 'ts' },
        { name: 'TRANSLATIONS', color: '#FD6860', background: '#FFF6F7', code: 'translations' },
        { name: 'BUGFIX', color: '#2E7DFF', background: '#F2F7FD', code: 'bugfix' },
    ];
    urgencyList: Urgency[] = [
        { title: 'Low', code: 0, color: '#F8D4C7' },
        { title: 'Medium', code: 1, color: '#FFE8BC' },
        { title: 'High', code: 2, color: '#E5C7F5' },
    ];
    draggedTask: any;

    selectedTasks: any[] = [];
    startColumnId: any = null;

    selectedImage: string = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private firestore: Firestore,
        private storage: Storage) {
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
                    // sort tasks in columns by creation date
                    this.project.columns.forEach((column: Column) => {
                        column.tasks.sort((a: Task, b: Task) => {
                            return a.creationDate - b.creationDate;
                        });
                    });
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
                                completed: this.selectedTask.completed ? this.selectedTask.completed : false,
                                images: this.selectedTask.images ? this.selectedTask.images : [],
                                creationDate: new Date().toUTCString(),
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
                                task.urgency = this.selectedTask.urgency;
                                task.labels = this.selectedTask.labels ? this.selectedTask.labels : [];
                                task.checkboxes = this.selectedTask.checkboxes ? this.selectedTask.checkboxes : [];
                                task.completed = this.selectedTask.completed ? this.selectedTask.completed : false;
                                task.images = this.selectedTask.images ? this.selectedTask.images : [];
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
    uploadTaskImage(event: any) {
        const image = event.target.files[0];
        const imgRef = ref(this.storage, `taskImages/${image.name}`);

        if (this.selectedTask.images == null) {
            this.selectedTask.images = [];
        }

        uploadBytes(imgRef, image)
            .then(response => {
                getDownloadURL(response.ref).then(url => {
                    this.selectedTask.images.push(url);
                });
            })
            .catch(error => console.log(error));
    }

    removeImage(image: string) {
        this.selectedTask.images = this.selectedTask.images.filter(img => img !== image);
    }

    primengDrop(columnId: number, tasks: any) {
        if (this.draggedTask && this.startColumnId !== columnId) {
            this.project.columns[columnId].tasks = [
                ...this.project.columns[columnId].tasks,
                this.draggedTask,
            ];
            // sort tasks by creation date
            this.project.columns[columnId].tasks.sort((a: any, b: any) => {
                return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
            });
            this.project.columns[this.startColumnId].tasks = this.project.columns[
                this.startColumnId
            ].tasks.filter((val, i) => val.id != this.draggedTask.id);
            this.draggedTask = null;
        }
        updateDoc(doc(this.firestore, 'projects', this.projectId), {
            columns: this.project.columns.map((column: any) => {
                return column;
            }
            )
        });
    }

    dragStart(task: any, startColumdId: number) {
        this.draggedTask = JSON.parse(JSON.stringify(task));
        this.startColumnId = startColumdId;
    }

    dragEnd() {
        this.draggedTask = null;
        this.startColumnId = null;
    }

    saveCheckbox(event: any, task: Task) {
        event.stopPropagation();

        setTimeout(() => {
            this.selectedTask = task;
            this.addTask();
        }, 100);
    }

    showCheckbox(event: any, taskId: string) {
        event.stopPropagation();
        if (this.showCheckboxes === taskId) {
            this.showCheckboxes = '';
        } else {
            this.showCheckboxes = taskId;
        }
    }

    addCheckbox() {
        this.selectedTask.checkboxes.push({
            id: this.idGenerator(),
            title: this.newCheckbox,
            checked: false,
        });
        this.newCheckbox = '';
    }

    deleteCheckbox(checkbox: Checkboxes) {
        this.selectedTask.checkboxes = this.selectedTask.checkboxes.filter(c => c.id !== checkbox.id);
    }

    getTotalCompletedTasks(task: Task) {
        return task.checkboxes.filter(t => t.checked).length;
    }

    toggleTaskCompleted(event?: any, task?: Task) {
        if (event) {
          event.stopPropagation();
        }
        this.selectedTask = task ? task : this.selectedTask;
        this.selectedTask.completed = !this.selectedTask.completed;

        this.addTask();
    }

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
            )
        });
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
