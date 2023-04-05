import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Checkboxes, Column, Images, Labels, Project, Task, Urgency } from 'src/app/interfaces/Kanban.interfaces';
import { KanbanService } from 'src/app/kanban-service.service';
import { from } from 'rxjs';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.sass'],
    providers: [KanbanService],
})
export class CardComponent implements OnInit {
    @Input() task: Task = {} as Task;
    @Input() index: any = 0 as number;
    @Input() taskProjectId: string | undefined;
    @Input() columnId: string | undefined;

    @Output() dragStart: EventEmitter<any> = new EventEmitter<any>();
    @Output() dragEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output() updateKanban: EventEmitter<any> = new EventEmitter<any>();

    timeouts: NodeJS.Timeout[] = [];

    showAddTaskModal = false;
    draggedTask: any;
    project!: Project;
    showCheckboxes = false;
    showImages = false;
    newCheckbox = '';
    selectedImage: any = '';
    labelsList: Labels[] = [
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
    selectedLabel: any = null;

    showModalCheckboxes = true;
    showModalFiles = true;
    columnName = '';

    constructor(
        private kanbanService: KanbanService) { }

    ngOnInit(): void {
        if (this.taskProjectId) {
            from(this.kanbanService.getProjectById(this.taskProjectId)).subscribe((project: Project) => {
                this.project = project;
                // add projectId to project
                this.project.id = this.taskProjectId;
                // get column name of task
                this.project.columns.forEach((column: Column) => {
                    column.tasks.forEach((searchTask: any) => {
                        if (searchTask.id === this.task.id) {
                            this.columnName = column.title;
                        }
                    });
                });
            });
        }
    }

    editTask() {
        // update task in column in project
        this.project.columns.forEach((column: Column) => {
            column.tasks = column.tasks.map((searchTask: any) => {
                if (searchTask.id === this.task.id) {
                    this.task.modificationDate = new Date().toUTCString();
                    return this.task;
                }
                return searchTask;
            });
        });

        // Update project
        this.kanbanService.updateProject(this.project);


        // Close modal
        this.showAddTaskModal = false;
    }

    saveCheckbox(event?: any, isInput?: boolean, checkbox?: Checkboxes) {
        this.timeouts.forEach((timeout: NodeJS.Timeout) => {
            clearTimeout(timeout);
        });
        event.stopPropagation();
        // update task in column in project
        this.project.columns.forEach((column: Column) => {
            column.tasks = column.tasks.map((searchTask: any) => {
                if (searchTask.id === this.task.id) {
                    this.task.modificationDate = new Date().toUTCString();
                    if (isInput) {
                        this.task.checkboxes = this.task.checkboxes.map((searchCheckbox: Checkboxes) => {
                            if (searchCheckbox.id === checkbox!.id) {
                                checkbox!.title = event.target.value;
                            }
                            return searchCheckbox;
                        });
                    }
                    return this.task;
                }
                return searchTask;
            });
        });

        let tO = setTimeout(() => {

            this.editTask();
        }, 500);
        this.timeouts.push(tO);
    }

    async deleteTask(event?: any) {
        event.stopPropagation();
        // remove task from column
        this.project.columns.forEach((column: Column) => {
            column.tasks = column.tasks.filter((searchTask: any) => searchTask.id !== this.task.id);
        });

        // Update project
        this.kanbanService.updateProject(this.project);

        this.updateKanban.emit();
    }

    //#region Helpers
    onLabelRemove(label: Labels) {
        this.task.labels = this.task.labels.filter(l => l.name !== label.name);

        setTimeout(() => {
            this.editTask();
        }, 100);
    }

    onLabelSelect(event: any) {
        console.log('onLabelSelect', event);
        // push event.value to task
        this.task.labels = [...this.task.labels, event.value];
        event.value = '';
        this.selectedLabel = null;
    }

    toggleTaskCompleted(event?: any, task?: Task) {
        if (event) {
            event.stopPropagation();
        }
        this.task.completed = !this.task.completed;

        setTimeout(() => {
            this.editTask();
        }, 100);
    }

    deleteCheckbox(event?: any, checkbox?: Checkboxes) {
        event.stopPropagation();
        this.task.checkboxes = this.task.checkboxes.filter(c => c.id !== checkbox!.id);

        if (event) {
            this.kanbanService.updateProject(this.project);
        }
    }

    deleteCheckboxInline(checkbox: Checkboxes) {
        this.task.checkboxes = this.task.checkboxes.filter(c => c.id !== checkbox.id);
        this.saveCheckbox();
    }

    getTotalCompletedTasks() {
        return this.task.checkboxes.filter(t => t.checked).length;
    }

    manageInlineCheckboxEdit(event: any) {
        event.stopPropagation();
    }

    cardDragStart() {
        if (this.columnId) {
            this.draggedTask = JSON.parse(JSON.stringify(this.task));
            let data = {
                task: this.draggedTask,
                startColumnId: this.index
            };

            this.dragStart.emit(data);
        }
    }

    cardDragEnd() {
        this.dragEnd.emit();
    }

    showCheckbox(event: any, taskId: string) {
        event.stopPropagation();
        this.showCheckboxes = !this.showCheckboxes;
        this.showImages = false;
    }

    showImagesFooter(event: any, taskId: string) {
        event.stopPropagation();
        this.showImages = !this.showImages;
        this.showCheckboxes = false;
    }

    addCheckbox(event?: any) {
        if (event) {
            event.stopPropagation();
        }
        this.task.checkboxes.push({
            id: this.idGenerator(),
            title: this.newCheckbox,
            checked: false,
        });
        this.newCheckbox = '';
    }

    uploadTaskImage(event: any) {
        const image = event.target.files[0];

        if (image) {
            this.kanbanService.uploadImage(image).then((image: Images) => {
                console.log('image', image);
                let imageObject: Images = {
                    url: image.url,
                    name: image.name
                };
                this.task.images.push(imageObject);
            });
        }
    }

    removeImage(image: Images) {
        this.task.images = this.task.images.filter(img => img.url !== image.url);
    }

    hideModal() {
        this.showAddTaskModal = false;
        this.showModalFiles = true;
        this.showModalCheckboxes = true;
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
    //#endregion
}
