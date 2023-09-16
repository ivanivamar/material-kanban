import {KanbanService} from './../kanban-service.service';
import {Checkboxes, Labels, Project, Urgency, Task, Status} from './../interfaces/Kanban.interfaces';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {from, Observable} from 'rxjs';
import {MultiSelectModule} from 'primeng/multiselect';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-kanban-board',
    templateUrl: './kanban-board.component.html',
    styleUrls: ['./kanban-board.component.sass'],
})
export class KanbanBoardComponent implements OnInit {
    ProjectTabs = ProjectTabs;
    searchTerm: string = '';
    currentTab: ProjectTabs = ProjectTabs.List;

    projects: any[] = [];
    project: Project = {} as Project;
    projectId: string = '';
    loading: boolean = false;

    user: any;

    showAddColumnModal: boolean = false;
    columnTitle: string = '';

    showEditColumnModal: boolean = false;
    columnEditId: string = '';
    columnEditTitle: string = '';

    showAddTaskModal: boolean = false;

    showCheckboxes: string = '';

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
    currentListTab: string = 'all';

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
    draggedTask: any;
    startColumnId: any;

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
                        this.loading = false;
                        console.log(this.project);
                    }, 200);
                });

                // check if user is logged in
                this.authService.isLoggedIn().then((user: any) => {
                    this.user = user;
                });
            }
        });
    }

    navigateToProject(project: Project) {
        this.router.navigate(['/projects/kanban'], {
            queryParams: {projectId: project.id},
        });
    }

    updateKanban() {
        from(this.kanbanService.getProjectById(this.projectId)).subscribe((project: Project) => {
            setTimeout(() => {
                this.project = project;
                // add projectId to project object
                this.project.id = this.projectId;
                this.loading = false;
                console.log(this.project);
            }, 200);
        });
    }

    editColumnSetup(columnId: string, columnTitle: string) {
        this.columnEditId = columnId;
        this.columnEditTitle = columnTitle;
        this.showEditColumnModal = true;
    }

    addTaskSetup() {

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
            owner: this.user.uid,
            assignee: [],
        };

        // Add new task to column
        this.project.tasks.push(newTask);

        console.log(this.project);

        // Update project
        await this.kanbanService.updateProject(this.project);
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
    List,
    Kanban,
    Timeline,
}
