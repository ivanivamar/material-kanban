import {KanbanService} from '../../shared/services/kanban-service.service';
import {Project, Status, StatusList, Task, Urgency, UrgencyList} from './../interfaces/Kanban.interfaces';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {ConfirmationService, MessageService} from "primeng/api";
import {ProjectDetailsTasksComponent} from "./project-details-tasks/project-details-tasks.component";
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
    project: Project = new Project();
    projectId: string = '';
    newTask: Task = {
        id: '',
        title: '',
        labels: [],
        status: 0,
        description: '',
        subtasks: [],
        urgency: UrgencyList[0],
        creationDate: new Date().toString(),
        modificationDate: new Date().toString(),
        completed: false,
        images: [],
        dueDate: new Date().toString(),
    };
    loading: boolean = false;

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
                    // set overview to url
                    this._location.go(`/projects/${this.projectId}/overview`);
                }
            }
        });
    }

    async getProject() {
        this.project = await this.kanbanService.getProjectById(this.projectId);
        // order tasks by creationDate
        this.project.tasks.sort((a, b) => {
            return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        });
        this.loading = false;
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
        this._location.go(`/projects/${this.projectId}/${tab.title.toLowerCase()}`);
    }

    getPendingTasks(): number {
        // check if task is in progress
        let pendingTasks = 0;
        if (this.project.tasks.length > 0) {
            this.project.tasks.filter(task => {
                if ((task.status == 0 && !task.completed)) {
                    pendingTasks++;
                }
            });
        }
        return pendingTasks;
    }

    async saveTask() {
        this.currentTab = this.tabs[1];
        this.newTask.id = this.kanbanService.idGenerator();
        this.newTask.creationDate = new Date().toString();
        this.newTask.modificationDate = new Date().toString();
        this.project.tasks.push(this.newTask as Task);
        this.project.tasks.sort((a, b) => {
            return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        });
        await this.kanbanService.updateProject(this.project);
        this.newTask = {
            id: '',
            title: '',
            labels: [],
            status: 0,
            description: '',
            subtasks: [],
            urgency: UrgencyList[0],
            creationDate: new Date().toString(),
            modificationDate: new Date().toString(),
            completed: false,
            images: [],
            dueDate: new Date().toString(),
        };
    }

    async goToTask(task: Task) {
        this.currentTab = this.tabs[1];
        //this.tasksComponent.showTask(task);
    }
}

export enum ProjectTabs {
    Overview,
    Tasks,
    Files,
    Settings
}
