import { KanbanService } from './../kanban-service.service';
import { Checkboxes, Column, Labels, Project, Urgency, Task } from './../interfaces/Kanban.interfaces';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-kanban-board',
    templateUrl: './kanban-board.component.html',
    styleUrls: ['./kanban-board.component.sass'],
})
export class KanbanBoardComponent implements OnInit {
    ProjectTabs = ProjectTabs;
    currentTab: ProjectTabs = ProjectTabs.Kanban;

    projects: any[] = [];
    project: Project = {} as Project;
    projectId: string = '';
    loading: boolean = false;

    showAddColumnModal: boolean = false;
    columnTitle: string = '';

    showEditColumnModal: boolean = false;
    columnEditId: string = '';
    columnEditTitle: string = '';

    showAddTaskModal: boolean = false;

    showCheckboxes: string = '';

    labelsList = [
        { name: 'FRONTEND', color: '#2E7DFF', background: '#F2F7FD', code: 'frontend' },
        { name: 'TS', color: '#FDAF1B', background: '#FFFBF2', code: 'ts' },
        { name: 'TRANSLATIONS', color: '#FD6860', background: '#FFF6F7', code: 'translations' },
        { name: 'BUGFIX', color: '#2E7DFF', background: '#F2F7FD', code: 'bugfix' },
    ];
    urgencyList: Urgency[] = [
        { title: 'Low', code: 0, color: '#DBDBDE' },
        { title: 'Normal', code: 1, color: '#2E7DFF' },
        { title: 'High', code: 2, color: '#FDC33E' },
        { title: 'Urgent', code: 3, color: '#FC6252' },
    ];
    draggedTask: any;
    startColumnId: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private kanbanService: KanbanService) {
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
            }
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
    async addColumn() {
        this.loading = true;
        let newColumn: Column = {
            id: this.idGenerator(),
            title: this.columnTitle,
            tasks: [],
        };

        // Add new column to project
        this.project.columns.push(newColumn);

        // Update project
        this.kanbanService.updateProject(this.project);

        this.loading = false;
        this.showAddColumnModal = false;
    }

    async editColumn() {
        this.loading = true;

        // Update existing column
        this.project.columns.forEach((column: Column) => {
            if (column.id === this.columnEditId) {
                column.title = this.columnEditTitle;
            }
        });

        // Update project
        this.kanbanService.updateProject(this.project);

        this.columnEditTitle = '';
        this.loading = false;
        this.showEditColumnModal = false;
    }

    async addTask(columnId: string) {
        this.loading = true;

        let newTask: Task = {
            id: this.idGenerator(),
            title: '',
            description: '',
            urgency: this.urgencyList[0],
            labels: [],
            checkboxes: [],
            completed: false,
            images: [],
            creationDate: new Date().toUTCString(),
            modificationDate: new Date().toUTCString(),
            dueDate: new Date(),
        };

        // Add new task to column
        this.project.columns.forEach((column: Column) => {
            if (column.id === columnId) {
                column.tasks.push(newTask);
            }
        });

        console.log(this.project);

        // Update project
        this.kanbanService.updateProject(this.project);

        this.loading = false;
    }

    //#endregion

    //#region Deleters
    async deleteColumn(columnId: string) {
        this.loading = true;

        // remove column from project
        this.project.columns = this.project.columns.filter((column: any) => column.id !== columnId);

        // Update project
        this.kanbanService.updateProject(this.project);

        this.loading = false;
    }

    async deleteTask(taskId: any) {
        this.loading = true;

        // remove task from column
        this.project.columns.forEach((column: Column) => {
            column.tasks = column.tasks.filter((task: any) => task.id !== taskId);
        });

        // Update project
        this.kanbanService.updateProject(this.project);

        this.loading = false;
    }
    //#endregion


    //#region Helpers
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

    onDragStart() {
        this.playAudio('assets/drag.mp3', 0.3);
    }

    playAudio(url: string, volume: number) {
        const audio = new Audio();
        audio.volume = volume;
        audio.src = url;
        audio.load();
        audio.play();
    }

    getConnectedLists(columnId: string): string[] {
        // return the ids of all the other columns that aren't this one
        return this.project.columns.filter(c => c.id !== columnId).map(c => 'column-' + c.id);
    }

    private async editColumnOnDrag(project: Project) {
        this.loading = true;

        // Update project
        this.kanbanService.updateProject(project);

        this.loading = false;
    }

    private idGenerator(): string {
        // letters + numbers
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
    Kanban,
    Calendar,
}
