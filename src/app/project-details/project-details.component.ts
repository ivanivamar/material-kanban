import {KanbanService} from '../../shared/services/kanban-service.service';
import {Project, Status, Task, Urgency, UserLite} from './../interfaces/Kanban.interfaces';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {AuthService} from '../../shared/services/auth.service';
import {TaskFilters} from "./task-filters/task-filters.component";
import {ProjectDetails} from "../../shared/helpers/projectClasses";
import {ConfirmationService, MessageService} from "primeng/api";
import {ProjectDetailsTasksComponent} from "./project-details-tasks/project-details-tasks.component";
import {ProjectDetailsOverviewComponent} from "./project-details-overview/project-details-overview.component";
import {ProjectDetailsSettingsComponent} from "./project-details-settings/project-details-settings.component";

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.sass'],
    providers: [KanbanService, AuthService, MessageService, ConfirmationService]
})
export class ProjectDetailsComponent implements OnInit {
    // @ts-ignore
    tasksComponent: ProjectDetailsTasksComponent;

    @ViewChild('tasksComponent', {static: false}) set content(content: ProjectDetailsTasksComponent) {
        if (content) {
            this.tasksComponent = content;
        }
    };

    ProjectTabs = ProjectTabs;
    searchTerm: string = '';
    tabs = [
        {
            title: 'Overview',
            breadcrumb: 'View Project',
            value: ProjectTabs.Overview,
        },
        {
            title: 'Tasks',
            breadcrumb: 'Project Tasks',
            value: ProjectTabs.Tasks,
        },
        {
            title: 'Members',
            breadcrumb: 'Project Members',
            value: ProjectTabs.Members,
        },
        {
            title: 'Files',
            breadcrumb: 'Project Files',
            value: ProjectTabs.Files,
        },
        {
            title: 'Settings',
            breadcrumb: 'Project Settings',
            value: ProjectTabs.Settings,
        },
    ];
    currentTab = this.tabs[0];

    projects: any[] = [];
    project: ProjectDetails = new ProjectDetails();
    tasksOg: Task[] = [];
    projectId: string = '';
    loading: boolean = false;
    membersList: UserLite[] = [];

    user: any;
    users: any[] = [];
    statusList: Status[] = [
        {
            value: 0,
            name: 'To Do',
            icon: 'pause_circle',
            type: 'secondary',
        },
        {
            value: 1,
            name: 'In Progress',
            icon: 'clock_loader_40',
            type: 'primary',
        },
        {
            value: 2,
            name: 'Review',
            icon: 'draw',
            type: 'warning',
        },
        {
            value: 3,
            name: 'Completed',
            icon: 'verified',
            type: 'success',
        },
    ];
    labelsList = [
        {name: 'FRONTEND', color: '#2E7DFF', background: '#F2F7FD', code: 'frontend'},
        {name: 'TS', color: '#FDAF1B', background: '#FFFBF2', code: 'ts'},
        {name: 'TRANSLATIONS', color: '#FD6860', background: '#FFF6F7', code: 'translations'},
        {name: 'BUGFIX', color: '#2E7DFF', background: '#F2F7FD', code: 'bugfix'},
    ];
    urgencyList: Urgency[] = [
        {title: 'Low', code: 0, color: '#DBDBDE'},
        {title: 'Normal', code: 1, color: '#2E7DFF'},
        {title: 'High', code: 2, color: '#FDC33E'},
        {title: 'Urgent', code: 3, color: '#FC6252'},
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private kanbanService: KanbanService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,) {
    }

    ngOnInit(): void {
        // get project id from url
        this.route.url.subscribe(async (url: any) => {
            if (url.length === 0) {
                this.router.navigate(['']);
            } else {
                this.loading = true;
                this.projectId = url[1].path;

                // check if user is logged in
                this.authService.isLoggedIn().then((user: any) => {
                    this.user = user;
                });
                await this.getUsers();
                await this.getProject();
            }
        });
    }

    async getProject() {
        this.kanbanService.getProjectById(this.projectId).subscribe((project: Project) => {
            this.project = project;
            // add projectId to project object
            this.project.id = this.projectId;
            // order tasks by creationDate
            this.project.tasks.sort((a, b) => {
                return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
            });
            this.tasksOg = this.project.tasks;
            this.membersList = JSON.parse(JSON.stringify(this.project.members));
            this.membersList.push(this.project.owner);
            this.loading = false;
        });
    }

    async getUsers() {
        this.kanbanService.getUsers().subscribe((users: any[]) => {
            this.users = users.filter((user: any) => {
                return user.uid !== this.user.uid;
            });
        });
    }

    getPendingTasks(): number {
        // check if task is in progress
        let pendingTasks = 0;
        if (this.project.tasks.length > 0) {
            this.project.tasks.filter(task => {
                if ((task.status.value == 0 && !task.completed)) {
                    pendingTasks++;
                }
            });
        }
        return pendingTasks;
    }

    //#region Setters
    async addTask(task?: any) {
        this.currentTab = this.tabs[1];
        setTimeout(() => {
            if (this.tasksComponent === undefined) {
                setTimeout(() => {
                    this.addTask(task);
                }, 100);
            } else {
                this.tasksComponent.manageTask(task);
            }
        }, 100);
    }

    //#endregion


    //#region Helpers

    playAudio(url: string, volume: number) {
        const audio = new Audio();
        audio.volume = volume;
        audio.src = url;
        audio.load();
        audio.play();
    }

    private isEmpty(obj: any) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    }

    //#endregion
}

export enum ProjectTabs {
    Overview,
    Tasks,
    Members,
    Files,
    Settings
}
