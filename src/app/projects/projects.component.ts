import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { KanbanService } from '../kanban-service.service';
import { from, Observable, } from 'rxjs';
import {
    Project,
    Column,
    Task,
    Urgency,
    Checkboxes,
    IDropdownOption,
} from '../interfaces/Kanban.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass'],
  providers: [KanbanService, AuthService, ConfirmationService],
})
export class ProjectsComponent implements OnInit {
    projects: Project[] = [];
    showAddProjectModal: boolean = false;
    loading: boolean = false;
    project: Project = {} as Project;
    user: any;

    projectOptions: IDropdownOption[] = [
        { value: '1', label: 'Project 1' },
        { value: '2', label: 'Project 2' },
        { value: '3', label: 'Project 3' },
    ];
    selectedProject: any = null;
    inputVar: string = '';

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
        });
    }

    navigateToProject(project: Project) {
        this.router.navigate(['projects/kanban'], {
            queryParams: { projectId: project.id },
        });
    }

    editProjectSetup(project: Project, event: Event) {
        event.stopPropagation();
        this.project = project;
        this.showAddProjectModal = true;
    }

    closeProjectModal() {
        this.showAddProjectModal = false;
        this.project = {} as Project;
    }

    //#region Setters
    async addProject() {
        let project: Project = {
            id: this.idGenerator(),
            image: this.project.image,
            title: this.project.title,
            description: this.project.description,
            columns: [],
            uid: this.user.uid,
            order: this.projects.length + 1,
        };

        this.kanbanService.addProject(project);

        this.showAddProjectModal = false;
        this.project = {} as Project;
    }
    //#endregion

    //#region Deleters
    confirmDeleteProject(event: any, projectId: any) {
        event.stopPropagation();
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
