import {KanbanService} from 'src/shared/services/kanban-service.service';
import {Component, OnInit} from '@angular/core';
import {from} from 'rxjs';
import {
    Project, Status,
    Task, Urgency
} from '../interfaces/Kanban.interfaces';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
//import {ConfirmationService, MessageService} from 'primeng/api';
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
    providers: [KanbanService, AuthService, MessageService],
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
       // private confirmationService: ConfirmationService,
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

    createOrEditProject(project?: Project) {
        if (project) {
            this.selectedProject = project;
        } else {
            this.selectedProject = {
                title: '',
                description: '',
                tasks: [],
                image: '',
                owner: this.user,
				ownerId: this.user.uid,
                members: [],
                membersIds: [],
                completed: false,
            } as Project;
        }
        this.showAddProjectModal = true;
    }

    async shareProject() {
        // find user with this.userEmailToShare
        const user = this.users.find((user: any) => {
            return user.email === this.userEmailToShare;
        });
        if (user) {
            // check if project is already shared with this user
            this.selectedProject.members.forEach((member: any) => {
                if (member.email === user.email) {
                    this.shareWithError = 'This project is already shared with this user';
                    return;
                }
                if (member.email === this.user.email) {
                    this.shareWithError = 'You are already a member of this project';
                    return;
                }
                if (this.selectedProject.owner.email === user.email) {
                    this.shareWithError = 'This user is the owner of this project';
                    return;
                }
            });
            this.selectedProject.members.push(user);
            // update user
            if (user.sharedProjectsIds) {
                user.sharedProjectsIds.push(this.selectedProject.id);
            } else {
                user.sharedProjectsIds = [this.selectedProject.id];
            }
            await this.kanbanService.updateUser(user.uid, user);
            // reset userEmailToShare
            this.userEmailToShare = '';
        } else {
            this.shareWithError = 'User not found';
        }
    }

    async removeUserFromProject(user: any) {
        // remove user from sharedWith property
        this.selectedProject.members.forEach((u: any, index: number) => {
            if (u.email === user.email) {
                this.selectedProject.members.splice(index, 1);
            }
        });
        // remove project from user
        user.sharedProjectsIds.forEach((projectId: string, index: number) => {
            if (projectId === this.selectedProject.id) {
                user.sharedProjectsIds.splice(index, 1);
            }
        });
        await this.kanbanService.updateUser(user.uid, user);
    }

    //#region Setters
    async addProject() {
        if (!this.selectedProject.id) {
            this.selectedProject.owner = {
                username: this.user.displayName,
                email: this.user.email,
                photoURL: this.user.photoURL,
                uid: this.user.uid,
                sharedProjectsIds: [],
            };
            this.selectedProject.tasks = [];
            this.selectedProject.members = [];
            this.selectedProject.membersIds = [];
            this.selectedProject.completed = false;
        }

        await this.kanbanService[this.selectedProject.id ? 'updateProject' : 'addProject'](this.selectedProject);

        this.getProjects();

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
        return this.isEmpty(this.selectedProject.title);
    }

    //#region Deleters
    confirmDeleteProject(event: any, project: any) {
        event.stopPropagation();
        project.menu = !project.menu;
        /*this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to delete this project?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteProject(project.id, event);
            },
            reject: () => {
                return;
            },
        });*/
    }

    async deleteProject(projectId: string, event: any) {
        event.stopPropagation();
        this.kanbanService.deleteProject(projectId);
        // remove project from projectsTablePaginated
        this.projects.items.forEach((project: Project, index: number) => {
            if (project.id === projectId) {
                this.projects.items.splice(index, 1);
            }
        });
        this.projects.totalRecords = this.projects.items.length;
    }

    //#endregion

    //#region Helpers
    toggleMenu(event: any, project: any) {
        event.stopPropagation();
        project.menu = !project.menu;
    }

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
