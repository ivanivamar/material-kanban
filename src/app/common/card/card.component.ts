import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
    Checkboxes,
    IDropdownOption,
    Images,
    Labels,
    Project, Status,
    Task,
    Urgency, UserLite
} from 'src/app/interfaces/Kanban.interfaces';
import {KanbanService} from 'src/shared/services/kanban-service.service';
import {from} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import firebase from "firebase/compat";
import User = firebase.User;
import {DomSanitizer} from "@angular/platform-browser";

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
    @Input() taskProject: Project = {} as Project;

    @Output() updateKanban: EventEmitter<any> = new EventEmitter<any>();

    timeouts: NodeJS.Timeout[] = [];

    showAddTaskModal = false;
    draggedTask: any;
    project!: Project;
    members: any[] = [];
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
    addAssignee = false;
    showDropdown = false;

    showFileModal = false;
    newImageObject: Images = {} as Images;
    newFile: File = {} as File;
    downloadFileElement: any;

    constructor(
        private kanbanService: KanbanService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit(): void {
        if (this.taskProject) {
            this.project = this.taskProject;
            this.members = JSON.parse(JSON.stringify(this.project.members));
            // set members selected to false or true depending on if they are in the task assignees
            this.members = this.members.map((member: any) => {
                member.selected = this.task.assignees.find((assignee: any) => {
                    return assignee.uid === member.uid;
                });
                return member;
            });
            // add project owner to members
            this.members.push({
                uid: this.project.owner.uid,
                username: this.project.owner.username,
                selected: this.task.assignees.find((assignee: any) => {
                    return assignee.uid === this.project.owner.uid;
                }),
                photoURL: this.project.owner.photoURL,
            });
        }

        this.downloadFileElement = {
            name: '',
            url: '',
            type: '',
            extension: '',
            color: '',
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
			this.task.dueDate = new Date(this.task.dueDate);
            return task;
        });
        console.log(this.task);
        // Update project
        await this.kanbanService.updateProject(this.project);

        this.updateKanban.emit();
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

    confirmDeleteGlobal(event: any, method: string, object: any) {
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to delete this?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // @ts-ignore
                this[method](object);
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

    showImage(event: any, image: any) {
        event.stopPropagation();

        this.selectedImage = image;
    }

    onLabelSelect(event: any) {
        let newLabel = this.labelsList.find(l => l.value === event);
        // push event.value to task
        this.task.labels = [...this.task.labels, newLabel];
        this.selectedLabel = {label: '', value: null};

        this.editTask(false);
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

    deleteCheckbox(checkbox: Checkboxes, event?: any) {
        if (event) {
            event.stopPropagation();
        }
        this.task.checkboxes = this.task.checkboxes.filter(c => c.id !== checkbox!.id);

        if (event) {
            this.editTask(true);
        }
    }

    getTotalCompletedTasks() {
        return this.task.checkboxes.filter(t => t.checked).length;
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

    assignUsers() {
        console.log(this.members);
        // add to assignees array in task the selected users in this.members
        this.task.assignees = this.members.filter((member: any) => {
            return member.selected;
        });
    }

    removeTaskAssignee(user: UserLite) {
        this.task.assignees = this.task.assignees.filter(u => u.uid !== user.uid);
        // set member selected to false
        this.members = this.members.map((member: any) => {
            if (member.uid === user.uid) {
                member.selected = false;
            }
            return member;
        });
    }

    uploadTaskImage(event: any) {
        this.newFile = event.target.files[0];
        let nameOfFile = this.newFile.name;
        switch (this.newFile.type) {
            case 'image/png':
                this.newImageObject.type = 'image';
                this.newImageObject.extension = 'PNG';
                break;
            case 'image/jpeg':
                this.newImageObject.type = 'image';
                this.newImageObject.extension = 'JPEG';
                break;
            case 'image/jpg':
                this.newImageObject.type = 'image';
                this.newImageObject.extension = 'JPG';
                break;
            case 'application/pdf':
                this.newImageObject.type = 'file';
                this.newImageObject.extension = 'PDF';
                break;
            case 'application/doc':
                this.newImageObject.type = 'image';
                this.newImageObject.extension = 'DOC';
                break;
            case 'application/docx':
                this.newImageObject.type = 'image';
                this.newImageObject.extension = 'DOCX';
                break;
            case 'application/xls':
                this.newImageObject.type = 'image';
                this.newImageObject.extension = 'XLS';
                break;
            case 'application/xlsx':
                this.newImageObject.type = 'image';
                this.newImageObject.extension = 'XLSX';
                break;
            default:
                this.newImageObject.type = 'other';
                this.newImageObject.extension = 'OTHER';
                break;
        }
        this.newImageObject.name = nameOfFile;
        this.newImageObject.trueType = this.newFile.type;

        this.showFileModal = true;
    }

    addFile() {
        let sendData: Images = {
            name: this.newImageObject.name,
            url: this.newImageObject.url,
            type: this.newImageObject.type,
            extension: this.newImageObject.extension,
            color: '',
            trueType: this.newImageObject.trueType,
            updatedDate: new Date().toUTCString(),
        };

        if (sendData.url === '' || sendData.url === undefined) {
            this.kanbanService.uploadImage(sendData, this.newFile).then((file: any) => {
                sendData.url = file.url;
                this.task.images.push(sendData);
                this.editTask(false);

                this.closeFileModal();
            });
        } else {
            // replace the file in the task
            this.task.images = this.task.images.map((img: Images) => {
                if (img.url === sendData.url) {
                    img = sendData;
                }
                return img;
            });

            this.editTask(false);
            this.closeFileModal();
        }
    }

    viewFile(file: Images) {
        this.kanbanService.getUrlOfFile(file).then((url: any) => {
			if (file.type === 'image') {
				this.selectedImage = url;
			} else {
				// open file in new tab
				window.open(url, '_blank');
			}
        });
    }

    closeFileModal() {
        this.newImageObject = {} as Images;
        this.showFileModal = false;
    }

    removeFile(file: Images) {
        this.task.images = this.task.images.filter(img => img.url !== file.url);

        this.kanbanService.deleteImage(file);
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

    private idNumbersGenerator(): number {
        // numbers
        const chars = '0123456789';
        let autoId = '';
        for (let i = 0; i < 5; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return Number(autoId);
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

	formatToDate() {
		this.task.dueDate = new Date(this.task.dueDate).toUTCString();
	}

    //#endregion
}
