import { KanbanService } from 'src/app/kanban-service.service';
import { Component, OnInit } from '@angular/core';
import { from, Observable, } from 'rxjs';
import {
    Project,
    Column,
    Task,
    Urgency,
    Checkboxes,
} from '../interfaces/Kanban.interfaces';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ConfirmationService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-kanban-dashboard',
    templateUrl: './kanban-dashboard.component.html',
    styleUrls: ['./kanban-dashboard.component.sass'],
    providers: [KanbanService, AuthService, ConfirmationService],
})
export class KanbanDashboardComponent implements OnInit {
    projects: any[] = [];
    projectsTablePaginated: ProjectsTableHelper = {
        records: [],
        currentRecord: [],
        totalRecordCount: 0,
    };
    currentPage = 0;
    pageSize = 10;
    pageSizes = [5, 10, 25];
    showPageSizes = false;
    sortHeader = '';
    sortDirection = 'desc';

    showAddProjectModal: boolean = false;

    darkColorArray = ['#FFE8BC', '#E5C7F5', '#F8D4C7'];
    lightColorArray = ['#FFF9EB', '#F7F0FB', '#FFF2EE'];
    loading: boolean = false;
    projectTitle: string = '';
    projectDescription: string = '';

    data: any;
    options: any;

    currentWeekTasks: any[] = [];

    projectId: string = '';
    columnId: string = '';

    showTasksFromProject: string = '';

    user: any;
    firstTime: boolean = true;

    constructor(
        private kanbanService: KanbanService,
        private router: Router,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
    ) { }

    async ngOnInit(): Promise<void> {
        this.loading = true;

        // check if user is logged in
        this.authService.isLoggedIn().then((user: any) => {
            this.user = user;
        });

        from(this.kanbanService.getProjects()).subscribe((projects: any[]) => {
            this.projects = projects;

            // filter projects by user uid
            this.projects = this.projects.filter((project: Project) => {
                return project.uid === this.user.uid;
            });

            // order projects by order property
            this.projects.sort((a: Project, b: Project) => {
                return a.order - b.order;
            });

            // paginate projects
            this.projectsTablePaginated.records = [];
            this.projectsTablePaginated.currentRecord = [];
            this.projectsTablePaginated.totalRecordCount = 0;
            this.projects.forEach((project: Project, index: number) => {
                // put projects in groups of this.pageSize
                if (index % this.pageSize === 0) {
                    this.projectsTablePaginated.records.push([
                        project,
                    ]);
                }
                else {
                    this.projectsTablePaginated.records[
                        this.projectsTablePaginated.records.length - 1
                    ].push(project);
                }
            });
            this.projectsTablePaginated.totalRecordCount = this.projects.length;
            this.projectsTablePaginated.currentRecord = this.projectsTablePaginated.records[this.currentPage];

            this.loading = false;
            this.getCurrentWeekTasks();
            this.makeWeekTasksChart(this.projects);
        });
    }

    sorter(event: any) {
        if (event !== this.sortHeader) {
            this.sortDirection = 'desc';
        }
        this.sortHeader = event;
        switch (event) {
            case 'totalTasks':
                switch (this.sortDirection) {
                    case 'asc':
                        this.projects.sort((a: Project, b: Project) => {
                            return this.getTasksCount(a) - this.getTasksCount(b);
                        });
                        break;
                    case 'desc':
                        this.projects.sort((a: Project, b: Project) => {
                            return this.getTasksCount(b) - this.getTasksCount(a);
                        });
                        break;
                }
                break;
            case 'completedTasks':
                switch (this.sortDirection) {
                    case 'asc':
                        this.projects.sort((a: Project, b: Project) => {
                            return this.getTasksFromCompletedColumn(a) - this.getTasksFromCompletedColumn(b);
                        });
                        break;
                    case 'desc':
                        this.projects.sort((a: Project, b: Project) => {
                            return this.getTasksFromCompletedColumn(b) - this.getTasksFromCompletedColumn(a);
                        });
                        break;
                }
                break;
            case 'ongoingTasks':
                switch (this.sortDirection) {
                    case 'asc':
                        this.projects.sort((a: Project, b: Project) => {
                            return this.getTasksFromInProgressColumn(a) - this.getTasksFromInProgressColumn(b);
                        });
                        break;
                    case 'desc':
                        this.projects.sort((a: Project, b: Project) => {
                            return this.getTasksFromInProgressColumn(b) - this.getTasksFromInProgressColumn(a);
                        });
                        break;
                }
        }
        this.refreshTable();
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    refreshTable() {
        this.projectsTablePaginated.records = [];
        this.projectsTablePaginated.currentRecord = [];
        this.projectsTablePaginated.totalRecordCount = 0;
        this.projects.forEach((project: Project, index: number) => {
            // put projects in groups of this.pageSize
            if (index % this.pageSize === 0) {
                this.projectsTablePaginated.records.push([
                    project,
                ]);
            }
            else {
                this.projectsTablePaginated.records[
                    this.projectsTablePaginated.records.length - 1
                ].push(project);
            }
        });
        this.projectsTablePaginated.totalRecordCount = this.projects.length;
        this.projectsTablePaginated.currentRecord = this.projectsTablePaginated.records[this.currentPage];
    }

    getCurrentWeekTasks() {
        this.currentWeekTasks = [];
        let tasksArray: any[] = [];
        this.projects.forEach((project: Project) => {
            project.columns.forEach((column: Column) => {
                column.tasks.forEach((task: Task) => {
                    if (!task.completed) {
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
            if (tasksArray.length > 0) {
                this.currentWeekTasks.push(
                    {
                        project: project.title,
                        tasks: tasksArray
                    }
                );
            }
            tasksArray = [];
        });

        // set showTasksFromProject to first project that has tasks
        this.currentWeekTasks.forEach((project: any) => {
            if (project.tasks.length > 0) {
                this.showTasksFromProject = project.project;
            }
        });
    }

    makeWeekTasksChart(projects: Project[]) {
        this.data = {
            labels: [],
            datasets: [
                {
                    label: 'Projects Tasks',
                    data: [],
                    backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1,
                }
            ],
        };

        projects.forEach((project: Project) => {
            this.data.labels.push(project.title);
            this.data.datasets[0].data.push(this.getTasksCount(project));
        });

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

    navigateToProject(project: Project) {
        this.router.navigate(['/projects/kanban'], {
            queryParams: { projectId: project.id },
        });
    }

    //#region Setters
    async addProject() {
        let project: Project = {
            title: this.projectTitle,
            description: this.projectDescription,
            columns: [
                {
                    id: this.idGenerator(),
                    title: 'To Do',
                    tasks: [],
                },
                {
                    id: this.idGenerator(),
                    title: 'In Progress',
                    tasks: [],
                },
                {
                    id: this.idGenerator(),
                    title: 'Completed',
                    tasks: [],
                },
            ],
            uid: this.user.uid,
            order: this.projects.length + 1,
        };

        this.kanbanService.addProject(project);

        // add project to projectsTablePaginated
        if (this.projectsTablePaginated.currentRecord.length < this.pageSize) {
            this.projectsTablePaginated.records.push([project]);
        } else {
            this.projectsTablePaginated.records[
                this.currentPage
            ].push(project);
        }
        this.projectsTablePaginated.totalRecordCount = this.projects.length;
        this.projectsTablePaginated.currentRecord = this.projectsTablePaginated.records[0];
        console.log('%c this.projectsTablePaginated', 'color: #00b300', this.projectsTablePaginated);

        this.showAddProjectModal = false;
        this.projectTitle = '';
        this.projectDescription = '';
    }
    //#endregion

    closeProjectModal() {
        this.showAddProjectModal = false;
        this.projectTitle = '';
        this.projectDescription = '';
    }

    setDisabled(): boolean {
        if (this.isEmpty(this.projectTitle)) {
            return true;
        } else {
            return false;
        }
    }

    //#region Deleters
    confirmDeleteProject(event: any, project: any) {
        event.stopPropagation();
        project.menu = !project.menu;
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to delete this project?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteProject(project.id, event);
            },
            reject: () => {
                return;
            },
        });
    }

    async deleteProject(projectId: string, event: any) {
        event.stopPropagation();
        this.kanbanService.deleteProject(projectId);
        // remove project from projectsTablePaginated
        this.projectsTablePaginated.records.forEach((record: Project[], index: number) => {
            record.forEach((project: Project, index: number) => {
                if (project.id === projectId) {
                    record.splice(index, 1);
                }
            });
        });
        this.projectsTablePaginated.totalRecordCount = this.projects.length;
        this.projectsTablePaginated.currentRecord = this.projectsTablePaginated.records[0];
    }
    //#endregion

    //#region Helpers
    toggleMenu(event: any, project: any) {
        event.stopPropagation();
        project.menu = !project.menu;
    }

    editProject(event: any, project: any) {
        event.stopPropagation();
        project.menu = !project.menu;
        this.projectTitle = project.title;
        this.projectDescription = project.description;
        this.showAddProjectModal = true
    }

    getTotalCompletedTasks(task: Task) {
        return task.checkboxes.filter(t => t.checked).length;
    }

    getTasksCount(project: Project): number {
        let count = 0;
        project.columns.forEach((column: Column) => {
            count += column.tasks.length;
        });
        return count;
    }

    getTasksFromCompletedColumn(project: Project): number {
        let count = 0;
        project.columns.forEach((column: Column) => {
            if (column.title === 'Completed') {
                count += column.tasks.length;
            }
        });
        return count;
    }

    getTasksFromInProgressColumn(project: Project): number {
        let count = 0;
        project.columns.forEach((column: Column) => {
            if (column.title === 'In Progress') {
                count += column.tasks.length;
            }
        });
        return count;
    }

    toDateTime(secs: any) {
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);
        return t;
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.projects, event.previousIndex, event.currentIndex);

        this.projects.forEach((project: Project, index: number) => {
            project.order = index;
            this.kanbanService.updateProject(project);
        });
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

    getMonday(d: any) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }
    //#endregion
}

interface ProjectsTableHelper {
    records: Project[][];
    currentRecord: Project[];
    totalRecordCount: number;
}
