import { KanbanBoardComponent } from '../kanban-board/kanban-board.component';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    Firestore,
    collectionData,
    collection,
    addDoc,
    deleteDoc,
    doc,
    DocumentData,
    updateDoc,
    arrayUnion,
} from '@angular/fire/firestore';
import {
    Project,
    Column,
    Task,
    ProjectWithId,
    Urgency,
    Checkboxes,
} from '../interfaces/Kanban.interfaces';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-kanban-dashboard',
    templateUrl: './kanban-dashboard.component.html',
    styleUrls: ['./kanban-dashboard.component.sass'],
})
export class KanbanDashboardComponent implements OnInit {
    projects: any[] = [];
    showAddProjectModal: boolean = false;

    darkColorArray = ['#FFE8BC', '#E5C7F5', '#F8D4C7'];
    lightColorArray = ['#FFF9EB', '#F7F0FB', '#FFF2EE'];
    loading: boolean = false;
    project = null;

    projectTitle: string = '';

    data: any;
    options: any;

    currentWeekTasks: any[] = [];

    showAddColumnModal: boolean = false;
    columnTitle: string = '';

    projectId: string = '';
    columnId: string = '';

    showEditColumnModal: boolean = false;
    columnEditId: string = '';
    columnEditTitle: string = '';

    showAddTaskModal: boolean = false;
    taskColumnId: string = '';
    selectedTask: any;
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

    constructor(private firestore: Firestore, private router: Router) { }

    async ngOnInit(): Promise<void> {
        this.loading = true;
        this.getProjects().subscribe((projects: ProjectWithId[]) => {
            console.log(projects);
            this.projects = projects;
            this.loading = false;
            this.getCurrentWeekTasks();
            this.makeWeekTasksChart(this.projects);
        });
    }

    editTaskSetup(task: any) {
        this.selectedTask = task;
        this.projectId = task.projectId;
        this.columnId = task.columnId;
        this.showAddTaskModal = true;
    }

    getCurrentWeekTasks() {
        let tasksArray: any[] = [];
        this.projects.forEach((project: ProjectWithId) => {
            project.columns.forEach((column: Column) => {
                column.tasks.forEach((task: Task) => {
                    let taskDate = new Date(task.creationDate);
                    let today = new Date();

                    let taskDay = taskDate.getDay();
                    let todayDay = today.getDay();
                    console.log(taskDay, todayDay);

                    if (taskDay == todayDay && !task.completed) {
                        tasksArray.push(
                            {
                                projectId: project.id,
                                columnId: column.id,
                                task: task
                            }
                        );
                    }
                });
            });
            let sendData = {
                project: project.title,
                tasks: tasksArray
            }
            this.currentWeekTasks.push(sendData);
            tasksArray = [];
        });
    }

    makeWeekTasksChart(projects: ProjectWithId[]) {
        let weekTasks = [0, 0, 0, 0, 0];
        let lastWeekTasks = [0, 0, 0, 0, 0];

        projects.forEach((project: ProjectWithId) => {
            project.columns.forEach((column: Column) => {
                column.tasks.forEach((task: Task) => {
                    let taskDate = new Date(task.creationDate);

                    let taskDay = taskDate.getDay();
                    weekTasks[taskDay--]++;

                    let lastWeekDate = new Date(new Date().toUTCString());
                    if (taskDate > lastWeekDate) {
                        lastWeekTasks[taskDay--]++;
                    }
                });
            });
        });

        // remove 0 values from arrays
        weekTasks = weekTasks.filter((value) => value != 0);
        lastWeekTasks = lastWeekTasks.filter((value) => value != 0);

        this.data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [
                {
                    label: 'Current Week',
                    data: weekTasks,
                    borderColor: '#1A73E8',
                    fill: false,
                    tension: 0.4,
                },
                {
                    label: 'Previous Week',
                    data: lastWeekTasks,
                    borderColor: '#E8F0FE',
                    fill: false,
                    tension: 0.4,
                },
            ],
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            scales: {
                y: {
                    beginAtZero: true,
                    precision: 0
                },
            },
            scale: {
                ticks: {
                    precision: 0
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        };
    }

    navigateToProject(project: ProjectWithId) {
        this.router.navigate(['/dashboard/kanban'], {
            queryParams: { projectId: project.id },
        });
    }

    //#region Getters
    getProjects(): Observable<ProjectWithId[]> {
        const projectRef = collection(this.firestore, 'projects');
        return collectionData(projectRef, { idField: 'id' }) as Observable<
            ProjectWithId[]
        >;
    }

    getProjectById(projectId: string) {
        const projectRef = collection(this.firestore, 'projects');
        return doc(projectRef, projectId);
    }
    //#endregion

    //#region Setters
    async addProject() {
        let project: Project = {
            title: this.projectTitle,
            columns: []
        };
        const response = await this.sendAddProject(project);
        console.log(response);

        this.showAddProjectModal = false;
        this.projectTitle = '';
    }
    sendAddProject(project: any) {
        const projectRef = collection(this.firestore, 'projects');
        return addDoc(projectRef, project);
    }

    async addTask(projectId: string, columnId: string) {
        this.loading = true;
        const projectRef = doc(this.firestore, 'projects', projectId);
        this.projects.forEach((project: ProjectWithId) => {
            if (project.id == projectId) {
                project.columns.forEach((column: Column) => {
                    if (column.id == columnId) {
                        let task: Task = {
                            id: this.selectedTask.id,
                            title: this.selectedTask.title,
                            description: this.selectedTask.description,
                            creationDate: new Date(),
                            completed: false,
                            checkboxes: this.selectedTask.checkboxes,
                            labels: this.selectedTask.labels,
                            urgency: this.selectedTask.urgency,
                            images: this.selectedTask.images,
                        };
                        column.tasks.push(task);
                    }
                });
            }
        });
        const response = await this.sendAddTask(projectRef, this.projects);
        console.log(response);
        this.loading = false;
    }

    sendAddTask(projectRef: any, projects: any[]) {
        return updateDoc(projectRef, {
            columns: projects[0].columns,
        });
    }

    clearTask() {
        this.selectedTask = {} as Task;
        this.showAddTaskModal = false;
    }
    //#endregion

    //#region Deleters
    async deleteProject(projectId: string, event: any) {
        event.stopPropagation();
        const response = await this.sendDeleteProject(projectId);
        console.log(response);
    }
    sendDeleteProject(projectId: string) {
        const projectRef = collection(this.firestore, 'projects');
        return deleteDoc(doc(projectRef, projectId));
    }
    //#endregion

    //#region Helpers
    addCheckbox() {
        this.selectedTask.checkboxes.push({
            id: this.idGenerator(),
            title: this.newCheckbox,
            checked: false,
        });
        this.newCheckbox = '';
    }

    deleteCheckbox(checkbox: Checkboxes) {
        this.selectedTask.checkboxes = this.selectedTask.checkboxes.filter((c: { id: string; }) => c.id !== checkbox.id);
    }

    saveCheckbox(event: any, task: any) {
        event.stopPropagation();

        setTimeout(() => {
            this.selectedTask = task;
            this.addTask(task.projectId, task.columnId);
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

    getTotalCompletedTasks(task: Task) {
        return task.checkboxes.filter(t => t.checked).length;
    }

    toggleTaskCompleted(event?: any, task?: any) {
        event.stopPropagation();
        this.selectedTask = task ? task : this.selectedTask;
        console.log(this.selectedTask);
        this.selectedTask.completed = !this.selectedTask.completed;

        this.addTask(task.projectId, task.columnId);
    }

    getTasksCount(project: Project): number {
        let count = 0;
        project.columns.forEach((column: Column) => {
            count += column.tasks.length;
        });
        return count;
    }

    toDateTime(secs: any) {
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);
        return t;
    }

    private idGenerator(): string {
        // letters + numbers
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
                if (
                    input.length === 0 ||
                    input === '' ||
                    input === null ||
                    input === undefined
                ) {
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

    /* drop(event: CdkDragDrop<Task[]>, project: Project, column: Column) {
            moveItemInArray(column.tasks, event.previousIndex, event.currentIndex);
            //this.editColumn(project, column);
        } */
}
