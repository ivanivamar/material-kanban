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
    showAddProjectModal: boolean = false;

    darkColorArray = ['#FFE8BC', '#E5C7F5', '#F8D4C7'];
    lightColorArray = ['#FFF9EB', '#F7F0FB', '#FFF2EE'];
    loading: boolean = false;
    project = null;

    projectTitle: string = '';

    data: any;
    options: any;

    currentWeekTasks: any[] = [];

    projectId: string = '';
    columnId: string = '';

    showTasksFromProject: string = '';

    user: any;

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

            this.loading = false;
            this.getCurrentWeekTasks();
            this.makeWeekTasksChart(this.projects);
        });
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
            let sendData = {
                project: project.title,
                tasks: tasksArray
            }
            this.currentWeekTasks.push(sendData);
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
        this.router.navigate(['/kanban'], {
            queryParams: { projectId: project.id },
        });
    }

    //#region Setters
    async addProject() {
        let project: Project = {
            title: this.projectTitle,
            columns: [],
            uid: this.user.uid,
            order: this.projects.length + 1,
        };

        this.kanbanService.addProject(project);

        this.showAddProjectModal = false;
        this.projectTitle = '';
    }
    //#endregion

    //#region Deleters
    confirmDeleteProject(event: any, projectId: string) {
        console.log(event);
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to delete this project?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteProject(projectId, event);
            },
            reject: () => {
                return;
            },
        });
    }

    async deleteProject(projectId: string, event: any) {
        event.stopPropagation();
        this.kanbanService.deleteProject(projectId);
    }
    //#endregion

    //#region Helpers
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
