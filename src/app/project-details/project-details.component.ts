import {KanbanService} from '../../shared/services/kanban-service.service';
import {Checkboxes, Labels, Project, Urgency, Task, Status, UserLite} from './../interfaces/Kanban.interfaces';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {from, Observable} from 'rxjs';
import {MultiSelectModule} from 'primeng/multiselect';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {AuthService} from '../../shared/services/auth.service';
import {TaskFilters} from "./task-filters/task-filters.component";

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.sass'],
})
export class ProjectDetailsComponent implements OnInit {
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
    project: Project = {} as Project;
    tasksOg: Task[] = [];
    projectId: string = '';
    loading: boolean = false;
    membersList: UserLite[] = [];

    user: any;

    filtersData: TaskFilters[] = [];

    statusList: Status[] = [
        {
            name: 'To Do',
            icon: 'pause_circle',
            iconColor: '#000000',
            bgColor: '#F3F4F6',
            borderColor: '#EAEBEF',
        },
        {
            name: 'In Progress',
            icon: 'clock_loader_40',
            iconColor: '#045FF3',
            bgColor: '#EFF6FF',
            borderColor: '#C9E1FE',
        },
        {
            name: 'Review',
            icon: 'draw',
            iconColor: '#FFB800',
            bgColor: '#FFF6E5',
            borderColor: '#FFEACD',
        },
        {
            name: 'Completed',
            icon: 'verified',
            iconColor: '#00B341',
            bgColor: '#F0FFF0',
            borderColor: '#C9F9C9',
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
        private authService: AuthService,) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params == null || params['projectId'] == null) {
                this.router.navigate(['']);
            } else {
                this.loading = true;
                this.projectId = params['projectId'];
                from(this.kanbanService.getProjectById(this.projectId)).subscribe((project: Project) => {
                    setTimeout(() => {
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
                    }, 200);
                });

                // check if user is logged in
                this.authService.isLoggedIn().then((user: any) => {
                    this.user = user;
                });
            }
        });
    }

    updateKanban() {
        from(this.kanbanService.getProjectById(this.projectId)).subscribe((project: Project) => {
            setTimeout(() => {
                this.project = project;
                // add projectId to project object
                this.project.id = this.projectId;
                this.tasksOg = this.project.tasks;
                this.filterTasks(this.filtersData);
                this.loading = false;
            }, 200);
        });
    }

    //#region Setters
    async addTask(statusName?: string) {
        let statusFind: Status = this.statusList[0];
        if (statusName !== undefined) {
            this.statusList.forEach((status: Status) => {
                if (status.name === statusName) {
                    statusFind = status;
                }
            });
        }

        let newTask: Task = {
            id: this.idGenerator(),
            title: '',
            description: '',
            status: statusFind,
            urgency: this.urgencyList[0],
            labels: [],
            checkboxes: [],
            completed: false,
            images: [],
            creationDate: new Date().toUTCString(),
            modificationDate: new Date().toUTCString(),
            dueDate: new Date(),
            owner: {
                username: this.user.displayName,
                email: this.user.email,
                photoURL: this.user.photoURL,
                uid: this.user.uid,
                sharedProjectsIds: [],
            },
            assignees: [],
        };
        console.log(newTask);

        // Add new task to column
        this.project.tasks.push(newTask);
        this.tasksOg = this.project.tasks;
        this.filterTasks(this.filtersData);

        // Update project
        await this.kanbanService.updateProject(this.project);
    }

    updateFromMembers(members: UserLite []) {
        this.project.members = members;
        this.kanbanService.updateProject(this.project);
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
