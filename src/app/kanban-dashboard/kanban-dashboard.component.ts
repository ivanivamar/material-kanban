import {KanbanService} from 'src/app/kanban-service.service';
import {Component, OnInit} from '@angular/core';
import {from} from 'rxjs';
import {
    Project, Status,
    Task
} from '../interfaces/Kanban.interfaces';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ConfirmationService} from 'primeng/api';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-kanban-dashboard',
    templateUrl: './kanban-dashboard.component.html',
    styleUrls: ['./kanban-dashboard.component.sass'],
    providers: [KanbanService, AuthService, ConfirmationService],
})
export class KanbanDashboardComponent implements OnInit {
    projects: Project[] = [];
    selectedProject: Project = {} as Project;
    projectsTablePaginated: ProjectsTableHelper = {
        records: [],
        currentRecord: [],
        totalRecordCount: 0,
    };
    projectName: string = '';
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
    users: any[] = [];
    userEmailToShare: string = '';
    shareWithError: string = '';

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
            name: 'Completed',
            icon: 'verified',
            iconColor: '#00B341',
            bgColor: '#F0FFF0',
            borderColor: '#C9F9C9',
        },
        {
            name: 'Review',
            icon: 'draw',
            iconColor: '#FFB800',
            bgColor: '#FFF6E5',
            borderColor: '#FFEACD',
        },
        {
            name: 'Late',
            icon: 'warning',
            iconColor: '#FF0000',
            bgColor: '#FFF0F0',
            borderColor: '#FFD6D6',
        }
    ];

    firstTime: boolean = true;

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
            console.log('%c this.users', 'color: #00b300', this.users);
            from(this.kanbanService.getProjects()).subscribe((projects: any[]) => {
                console.log('%c projects', 'color: #00b300', projects);

                // filter projects by user uid
                this.projects = projects.filter((project: Project) => {
                    if (project.uid === this.user.uid) {
                        return true; // Include the project if the user owns it
                    }
                    if (project.sharedWith) {
                        for (const user of project.sharedWith) {
                            if (user.uid === this.user.uid) {
                                return true; // Include the project if the user is shared with it
                            }
                        }
                    }
                    return false;
                });
                console.log('%c this.projects after', 'color: #00b300', this.projects);

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
                    } else {
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
        });

    }

    sorter(event: any) {
        /*if (event !== this.sortHeader) {
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
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';*/
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
            } else {
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
            project.tasks.forEach((task: Task) => {
                if (!task.completed) {
                    tasksArray.push(
                        {
                            projectId: project.id,
                            task: task
                        }
                    );
                }
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
            this.data.datasets[0].data.push(project.tasks.length);
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
            queryParams: {projectId: project.id},
        });
    }

    createOrEditProject(project?: Project) {
        if (project) {
            this.selectedProject = project;
        } else {
            this.selectedProject = {
                title: '',
                description: '',
                tasks: [],
                uid: this.user.uid,
                sharedWith: [],
                completed: false,
                order: this.projects.length + 1,
            } as Project;
        }
        this.showAddProjectModal = true;
    }

    shareProject() {
        // find user with this.userEmailToShare
        const user = this.users.find((user: any) => {
            return user.email === this.userEmailToShare;
        });
        if (user) {
            // check if project is already shared with this user
            if (this.selectedProject.sharedWith) {
                if (this.selectedProject.sharedWith.includes(user.email)) {
                    this.shareWithError = 'This project is already shared with this user';
                    return;
                }
            }
            // add user email to sharedWith property
            if (this.selectedProject.sharedWith) {
                this.selectedProject.sharedWith.push(user);
            } else {
                this.selectedProject.sharedWith = [user];
            }
            // update user
            if (user.sharedProjects) {
                user.sharedProjects.push(this.selectedProject.id);
            } else {
                user.sharedProjects = [this.selectedProject.id];
            }
            this.kanbanService.updateUser(user.uid, user);
            // reset userEmailToShare
            this.userEmailToShare = '';
        } else {
            this.shareWithError = 'User not found';
        }
    }

    removeUserFromProject(user: any) {
        // remove user from sharedWith property
        // @ts-ignore
        this.selectedProject.sharedWith.forEach((u: any, index: number) => {
            if (u.email === user.email) {
                // @ts-ignore
                this.selectedProject.sharedWith.splice(index, 1);
            }
        });
        // remove project from user
        user.sharedProjects.forEach((projectId: string, index: number) => {
            if (projectId === this.selectedProject.id) {
                user.sharedProjects.splice(index, 1);
            }
        });
        this.kanbanService.updateUser(user.uid, user);
    }

    //#region Setters
    async addProject() {
        if (!this.selectedProject.id) {
            this.selectedProject.uid = this.user.uid;
            this.selectedProject.order = this.projects.length + 1;
            this.selectedProject.tasks = [];
        }
        console.log('%c this.selectedProject', 'color: #00b300', this.selectedProject);

        await this.kanbanService[this.selectedProject.id ? 'updateProject' : 'addProject'](this.selectedProject);

        // add project to projectsTablePaginated
        if (this.projectsTablePaginated.currentRecord.length < this.pageSize) {
            this.projectsTablePaginated.records.push([this.selectedProject]);
        } else {
            this.projectsTablePaginated.records[
                this.currentPage
                ].push(this.selectedProject);
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
        return this.isEmpty(this.selectedProject.title);
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
        this.projectsTablePaginated.records.forEach((record: Project[]) => {
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

    getTasksOfStatus(statusName: string, project: Project) {
        let count = 0;
        project.tasks.forEach((task: Task) => {
            if (task.status.name === statusName) {
                count++;
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

interface ProjectsTableHelper {
    records: Project[][];
    currentRecord: Project[];
    totalRecordCount: number;
}
