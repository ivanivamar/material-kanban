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

    filtersData: TaskFilters[] = [];

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
                await this.getProject();

                // check if user is logged in
                this.authService.isLoggedIn().then((user: any) => {
                    this.user = user;
                });
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

    //#region Deleters
    async deleteTask(taskId: any) {
        this.loading = true;

        // remove task from column
        this.project.tasks = this.project.tasks.filter((task: Task) => {
            return task.id !== taskId;
        });

        // Update project
        await this.kanbanService.updateProject(this.project);

        this.loading = false;
    }

    //#endregion


    //#region Helpers
    getTasksOfStatus(statusName: string, project: Project) {
        let count = 0;
        if (project.tasks.length > 0) {
            project.tasks.forEach((task: Task) => {
                if (task.status.name === statusName) {
                    count++;
                }
            });
        }
        return count;
    }

    filterTasks(filters: TaskFilters[]) {
        this.filtersData = filters;
        this.tasksOg = JSON.parse(JSON.stringify(this.project.tasks));
        console.log(this.filtersData);
        console.log(this.tasksOg);

        if (filters.length > 0) {
            filters.forEach((filter: TaskFilters) => {
                if (filter.name === 'status' && filter.values.length > 0) {
                    this.tasksOg = this.tasksOg.filter((task: Task) => {
                        return filter.values.includes(task.status.name);
                    });

                    // orderby status
                    if (filter.order === 'asc') {
                        this.tasksOg.sort((a: Task, b: Task) => {
                            return a.status.name.localeCompare(b.status.name);
                        });
                    } else if (filter.order === 'desc') {
                        this.tasksOg.sort((a: Task, b: Task) => {
                            return b.status.name.localeCompare(a.status.name);
                        });
                    }
                }
                if (filter.name === 'dueDate' && filter.value !== null) {
                    this.tasksOg = this.tasksOg.filter((task: Task) => {
                        return task.dueDate <= filter.value;
                    });

                    // orderby dueDate
                    if (filter.order === 'asc') {
                        this.tasksOg.sort((a: Task, b: Task) => {
                            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                        });
                    } else if (filter.order === 'desc') {
                        this.tasksOg.sort((a: Task, b: Task) => {
                            return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
                        });
                    }
                }
                if (filter.name === 'dateRange' && filter.values.length > 0) {
                    this.tasksOg = this.tasksOg.filter((task: Task) => {
                        return task.dueDate >= filter.values[0] && task.dueDate <= filter.values[1];
                    });

                    // orderby dueDate
                    if (filter.order === 'asc') {
                        this.tasksOg.sort((a: Task, b: Task) => {
                            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                        });
                    } else if (filter.order === 'desc') {
                        this.tasksOg.sort((a: Task, b: Task) => {
                            return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
                        });
                    }
                }
                if (filter.name === 'urgency' && filter.values.length > 0) {
                    this.tasksOg = this.tasksOg.filter((task: Task) => {
                        return filter.values.includes(task.urgency.title);
                    });
                }
                if (filter.name === 'assignedTo' && filter.values.length > 0) {
                    this.tasksOg = this.tasksOg.filter((task: Task) => {
                        let found = false;
                        task.assignees.forEach((assignee: UserLite) => {
                            filter.values.forEach((filterValue: UserLite) => {
                                if (assignee.uid === filterValue.uid) {
                                    found = true;
                                }
                            });
                        });
                        return found;
                    });

                    // orderby assignees
                    if (filter.order === 'asc') {
                        this.tasksOg.sort((a: Task, b: Task) => {
                            return a.assignees.length - b.assignees.length;
                        });
                    } else if (filter.order === 'desc') {
                        this.tasksOg.sort((a: Task, b: Task) => {
                            return b.assignees.length - a.assignees.length;
                        });
                    }
                }
            });
        }
    }

    drop(event: CdkDragDrop<Task[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
        this.playAudio('assets/drop.mp3', 1);

        this.kanbanService.updateProject(this.project);
    }

    playAudio(url: string, volume: number) {
        const audio = new Audio();
        audio.volume = volume;
        audio.src = url;
        audio.load();
        audio.play();
    }

    private idGenerator(): string {
        // letters + numbers
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

export enum ProjectTabs {
    Overview,
    Tasks,
    Members,
    Files,
    Settings
}
