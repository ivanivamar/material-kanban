import {ChangeDetectorRef, Component, EventEmitter, inject, Output} from '@angular/core';
import {ModalBaseComponent} from '../ModalBaseComponent';
import {Project, Status, Task} from '../../../modules/project';
import {RippleDirective} from '../ripple.directive';
import {FormsModule} from '@angular/forms';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {DatePipe, JsonPipe} from '@angular/common';
import {DropdownComponent, DropdownItem} from '../dropdown/dropdown.component';
import {DatePicker} from 'primeng/datepicker';
import {Dialog} from 'primeng/dialog';
import {Editor} from 'primeng/editor';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {Inplace} from 'primeng/inplace';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';

@Component({
    selector: 'app-task-modal',
    imports: [
        RippleDirective,
        FormsModule,
        DropdownComponent,
        DatePicker,
        Dialog,
        Editor,
        InputText,
        Select,
        Inplace,
        Accordion,
        AccordionPanel,
        AccordionHeader,
        AccordionContent
    ],
    templateUrl: './task-modal.component.html',
    styleUrl: './task-modal.component.css'
})
export class TaskModalComponent {
    private firebaseService = inject(FirebaseServiceService);

    @Output() onTaskCreated = new EventEmitter<Task>();
    @Output() deleteTask = new EventEmitter<Task>();

    showModal = false;
    projects: Project[] = [];
    selectedProject: Project = new Project();
    task: Task = new Task();
    statusArray = [
        {
            label: 'Not Started',
            value: Status.NOT_STARTED
        },
        {
            label: 'In Progress',
            value: Status.IN_PROGRESS
        },
        {
            label: 'Completed',
            value: Status.COMPLETED
        }
    ];
    dueDate: Date = new Date();

    public show(task: Task) {
        this.task = JSON.parse(JSON.stringify(task));
        this.dueDate = new Date(this.task.dueDate);
        this.showModal = true;
    }

    save() {
        this.task.updatedAt = new Date().toString();
        this.onTaskCreated.emit(this.task);
        this.close();
    }

    close(): void {
        this.showModal = false;
        this.task = new Task();
    }
}
