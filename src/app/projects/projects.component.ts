import {KanbanService} from 'src/shared/services/kanban-service.service';
import {Component, OnInit} from '@angular/core';
import {from} from 'rxjs';
import {
    Project, Status,
    Task, Urgency
} from '../interfaces/Kanban.interfaces';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableHelper} from "../../shared/helpers/tableHelper";
import {StatusList, UrgencyList} from "../../shared/helpers/projectClasses";

export interface ControllerInputDto {
    uid?: string;
    maxResultCount: number;
    elementToStartAt: any;
    isPrevious: boolean;
}

@Component({
    selector: 'app-kanban-dashboard',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.sass'],
    providers: [KanbanService, AuthService, ConfirmationService, MessageService],
})
export class ProjectsComponent implements OnInit {
    projects: TableHelper<Project> = new TableHelper<Project>();
    currentPageProjects: Project[] = [];
    selectedProject: Project = {} as Project;
    searchProject = '';

    showAddProjectModal: boolean = false;
    loading: boolean = false;
    projectTitle: string = '';
    projectDescription: string = '';

    data: any;

    user: any;
    users: any[] = [];
    userEmailToShare: string = '';
    shareWithError: string = '';

    statusList: Status[] = StatusList;
    urgencyList: Urgency[] = UrgencyList;

    constructor(
        private kanbanService: KanbanService,
        private router: Router,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
    ) {
    }

    async ngOnInit(): Promise<void> {
        this.loading = true;

        // check if user is logged in
        this.authService.isLoggedIn().then((user: any) => {
            this.user = user;
        });

        // get users
        from(this.kanbanService.getUsers()).subscribe((users: any[]) => {
            this.users = users.filter((user: any) => {
                return user.uid !== this.user.uid;
            });

            this.getProjects();
        });

    }

    getProjects() {
        from(this.kanbanService.getProjects(this.user.uid)).subscribe(async (result: PaginatedResult<Project>) => {
            this.projects.totalRecords = result.totalRecordCount;
            this.projects.items = result.records;

            await this.getCurrentPageProjects(1);
            this.loading = false;
        });
    }

    async getCurrentPageProjects(pageNumber: number) {
        this.currentPageProjects = [];
        const offset = (pageNumber - 1) * this.projects.countsPerPage
        const endIndex = Math.min(offset + this.projects.countsPerPage, this.projects.items.length);

        for (let i = offset; i < endIndex; i++) {
            this.currentPageProjects.push(this.projects.items[i]);
        }
    }

    getProgress(project: Project) {
        let completedTasks = 0;
        project.tasks.forEach((task: Task) => {
            if (task.completed) {
                completedTasks++;
            }
        });
        return (completedTasks / project.tasks.length) * 100;
    }

    searchProjects() {
        if (this.searchProject.length == 0) {
            this.getProjects();
        } else {
            this.currentPageProjects = this.projects.items.filter((project: Project) => {
                return project.title.toLowerCase().includes(this.searchProject.toLowerCase());
            });
        }
    }

    //#region Helpers
    getTasksOfStatus(statusValue: number, project: Project) {
        let count = 0;
        project.tasks.forEach((task: Task) => {
            if (task.status.value === statusValue) {
                count++;
            }
        });
        return count;
    }

    private idGenerator(): string {
        // letters + numbers
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let autoId = '';
        for (let i = 0; i < 5; i++) {
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

//#endregion
}

export interface PaginatedResult<T> {
    records: T[];
    totalRecordCount: number;
}
