import {KanbanService} from '../../shared/services/kanban-service.service';
import {Project, Status, Task, Urgency, UserLite} from './../interfaces/Kanban.interfaces';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {AuthService} from '../../shared/services/auth.service';
import {TaskFilters} from "./task-filters/task-filters.component";
import {ProjectDetails, StatusList, UrgencyList} from "../../shared/helpers/projectClasses";
import {ConfirmationService, MessageService} from "primeng/api";
import {ProjectDetailsTasksComponent} from "./project-details-tasks/project-details-tasks.component";
import {ProjectDetailsOverviewComponent} from "./project-details-overview/project-details-overview.component";
import {ProjectDetailsSettingsComponent} from "./project-details-settings/project-details-settings.component";
import {Location} from "@angular/common";

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
    tabs: any[] = [
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
    statusList: Status[] = StatusList;
    labelsList = [
        {name: 'FRONTEND', color: '#2E7DFF', background: '#F2F7FD', code: 'frontend'},
        {name: 'TS', color: '#FDAF1B', background: '#FFFBF2', code: 'ts'},
        {name: 'TRANSLATIONS', color: '#FD6860', background: '#FFF6F7', code: 'translations'},
        {name: 'BUGFIX', color: '#2E7DFF', background: '#F2F7FD', code: 'bugfix'},
    ];
    urgencyList: Urgency[] = UrgencyList;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private kanbanService: KanbanService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
        private _location: Location,
    ) {
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

                // set tab from url
                if (url[2]) {
                    this.currentTab = this.tabs.find(tab => tab.value === ProjectTabs[url[2].path[0].toUpperCase() + url[2].path.slice(1)]);
                } else {
                    this.currentTab = this.tabs[0];
                }
            }
        });
    }

    async getProject() {
        this.kanbanService.getProjectById(this.projectId).subscribe((project: Project) => {
            this.project = project;
            // add projectId to project object
            this.project.id = this.projectId;
            console.log("%c project", "color: green; font-size: 16px; font-weight: bold;", this.project);
            // order tasks by creationDate
            this.project.tasks.sort((a, b) => {
                return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
            });
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

    manageTabs(tab: any) {
        this.currentTab = tab;

        // update url
        let newUrL = `/projects/${this.projectId}/${tab.title.toLowerCase()}`;
        this._location.go(newUrL);
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
