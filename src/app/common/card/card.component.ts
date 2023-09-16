import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
    Checkboxes,
    IDropdownOption,
    Images,
    Labels,
    Project, Status,
    Task,
    Urgency
} from 'src/app/interfaces/Kanban.interfaces';
import {KanbanService} from 'src/app/kanban-service.service';
import {from} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import firebase from "firebase/compat";
import User = firebase.User;

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.sass'],
    providers: [KanbanService, MessageService, ConfirmationService],
})
export class CardComponent implements OnInit {
    @ViewChild('fileInput') fileInput: any;
    @ViewChild('addFiles') addFiles: any;

    @Input() task: Task = {} as Task;
    @Input() index: any = 0 as number;
    @Input() taskProjectId: string | undefined;
    @Input() columnId: string | undefined;

    @Output() updateKanban: EventEmitter<any> = new EventEmitter<any>();

    timeouts: NodeJS.Timeout[] = [];

    showAddTaskModal = false;
    draggedTask: any;
    project!: Project;
    showCheckboxes = false;
    showImages = false;
    newCheckbox = '';
    selectedImage: any = '';
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
    labelsList: IDropdownOption[] = [
        {label: 'Frontend', value: 'frontend'},
        {label: 'TypeScript', value: 'ts'},
        {label: 'Translations', value: 'translations'},
        {label: 'Bugfix', value: 'bugfix'},
    ];
    urgencyDropdownOptions: IDropdownOption[] = [
        {label: 'Low', value: 0, icon: 'flag', iconColor: '#DBDBDE'},
        {label: 'Normal', value: 1, icon: 'flag', iconColor: '#2E7DFF'},
        {label: 'High', value: 2, icon: 'flag', iconColor: '#FDC33E'},
        {label: 'Urgent', value: 3, icon: 'flag', iconColor: '#FC6252'},
    ];
    selectedLabel: IDropdownOption = {label: '', value: null};

    showModalCheckboxes = true;
    showModalFiles = true;
    columnName = '';

    users: any[] = [];
    taskAssigneeEmail = '';
    taskAssignee: User[] = [];
    addAssignee = false;

    constructor(
        private kanbanService: KanbanService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {
    }

    ngOnInit(): void {
        if (this.taskProjectId) {
            from(this.kanbanService.getProjectById(this.taskProjectId)).subscribe((project: Project) => {
                this.project = project;
                // add projectId to project
                this.project.id = this.taskProjectId;
                this.kanbanService.getUsers().subscribe((users: any) => {
                    this.users = users;
                    console.log('this.users', this.users);

                    this.users.forEach((user: any) => {
                        if (this.task.assignee.includes(user.uid)) {
                            this.taskAssignee.push(user);
                        }
                    });
                    console.log('this.task', this.task);
                });
            });
        }
    }

    async editTask(hideModal?: boolean) {
        if (hideModal === undefined) {
            hideModal = true;
        }
        // update task in column in project
        this.project.tasks = this.project.tasks.map((task: Task) => {
            if (task.id === this.task.id) {
                this.task.modificationDate = new Date().toUTCString();
                return this.task;
            }
            return task;
        });

        console.log('this.project', this.project);
        // Update project
        await this.kanbanService.updateProject(this.project);
        if (hideModal) {
            this.showAddTaskModal = false;
        } else {
            this.showAddTaskModal = true;
        }

        //this.messageService.add({severity: 'success', summary: 'Task updated', detail: 'Task updated'});
    }

    saveCheckbox(showModal: boolean, event?: any, isInput?: boolean, checkbox?: Checkboxes) {
        this.timeouts.forEach((timeout: NodeJS.Timeout) => {
            clearTimeout(timeout);
        });
        event.stopPropagation();
        // update task in column in project
        this.project.tasks.forEach((task: Task) => {
            if (task.id === this.task.id) {
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
            return task;
        });

        let tO = setTimeout(() => {
            this.editTask(true);

            // Close modal
            this.showAddTaskModal = showModal;
        }, 500);
        this.timeouts.push(tO);
    }

    confirmDelete(event?: any) {
        event.stopPropagation();
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this task?',
            target: event.target,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteTask();
            },
        });
    }

    async deleteTask() {
        // remove task from column
        this.project.tasks = this.project.tasks.filter((task: Task) => {
            return task.id !== this.task.id;
        });

        // Update project
        await this.kanbanService.updateProject(this.project);

        this.updateKanban.emit();
    }

    //#region Helpers
    drop(event: CdkDragDrop<Checkboxes[]>, show: boolean) {
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

        this.editTask(show);
    }

    playAudio(url: string, volume: number) {
        const audio = new Audio();
        audio.volume = volume;
        audio.src = url;
        audio.load();
        audio.play();
    }

    onLabelRemove(label: Labels) {
        this.task.labels = this.task.labels.filter(l => l.name !== label.name);

        this.editTask(false);
    }

    fileInputClick(event: any) {
        event.stopPropagation();

        this.fileInput.nativeElement.click();
        this.showAddTaskModal = false;
    }

    fileInputClickInside(event: any) {
        event.stopPropagation();
        this.addFiles.nativeElement.click();
    }

    showImage(event: any, image: any) {
        event.stopPropagation();

        this.selectedImage = image;
    }

    manageClick(event: any) {
        event.stopPropagation();
    }

    onLabelSelect(event: any) {
        let newLabel = this.labelsList.find(l => l.value === event);
        // push event.value to task
        this.task.labels = [...this.task.labels, newLabel];
        this.selectedLabel = {label: '', value: null};

        this.editTask(false);
    }

    toggleTaskCompleted(event?: Event, task?: Task) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();

            this.showAddTaskModal = false;
        }
        this.task.completed = !this.task.completed;

        this.editTask(event ? true : false);
    }

    getCurrentCheckboxName() {
        // get the name of the first checkbox that is not checked
        let checkbox = this.task.checkboxes.find(c => !c.checked);
        if (checkbox) {
            return checkbox.title;
        }
        // if all checkboxes are checked, return last checkbox name
        return this.task.checkboxes[this.task.checkboxes.length - 1].title;
    }

    deleteCheckbox(event?: any, checkbox?: Checkboxes) {
        event.stopPropagation();
        this.task.checkboxes = this.task.checkboxes.filter(c => c.id !== checkbox!.id);

        if (event) {
            this.editTask(false);
        }
    }

    deleteCheckboxInline(event: any, checkbox: Checkboxes) {
        event.stopPropagation();
        this.task.checkboxes = this.task.checkboxes.filter(c => c.id !== checkbox.id);
        this.saveCheckbox(false);
    }

    getTotalCompletedTasks() {
        return this.task.checkboxes.filter(t => t.checked).length;
    }

    manageInlineCheckboxEdit(event: any) {
        event.stopPropagation();
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
            description: '',
            checked: false,
        });
        this.newCheckbox = '';
    }

    assignToTaskByEmail() {
        // find user by email
        let user = this.users.find(u => u.email === this.taskAssigneeEmail);
        if (user) {
            if (!this.task.assignee.includes(user.uid)) {
                this.task.assignee.push(user.uid);
                this.taskAssignee.push(user);
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'User already assigned',
                    detail: 'Try with another email',
                });
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'User not found',
                detail: 'Try with another email',
            });
        }
    }

    removeTaskAssignee(user: User) {
        this.task.assignee = this.task.assignee.filter(u => u !== user.uid);
        this.taskAssignee = this.taskAssignee.filter(u => u.uid !== user.uid);
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

        this.editTask(false);
    }

    removeImage(image: Images) {
        this.task.images = this.task.images.filter(img => img.url !== image.url);

        this.editTask(false);
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

    getTextOfNumber(number: number) {
        switch (number) {
            case 1:
                return 'one';
            case 2:
                return 'two';
            case 3:
                return 'three';
            case 4:
                return 'four';
        }
        return '';
    }

    getUserNameById(userId: string) {
        let user = this.users.find(u => u.uid === userId);
        return user ? user.username : '';
    }

    //#endregion
}
