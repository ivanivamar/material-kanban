import {ChangeDetectorRef, Component, EventEmitter, inject, Output} from '@angular/core';
import {ModalBaseComponent} from '../ModalBaseComponent';
import {Status, Task} from '../../../modules/project';
import {RippleDirective} from '../ripple.directive';
import {FormsModule} from '@angular/forms';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {DatePipe, JsonPipe} from '@angular/common';
import {DropdownComponent, DropdownItem} from '../dropdown/dropdown.component';

@Component({
    selector: 'app-task-modal',
    imports: [
        RippleDirective,
        FormsModule,
        DropdownComponent
    ],
    templateUrl: './task-modal.component.html',
    styleUrl: './task-modal.component.css'
})
export class TaskModalComponent extends ModalBaseComponent {
    @Output() onSave: EventEmitter<Task> = new EventEmitter();

    private firebaseService = inject(FirebaseServiceService);
    private changeDetectorRef = inject(ChangeDetectorRef);
    task: Task = new Task();
    statusOptions: DropdownItem[] = [
        { label: 'Not started', value: Status.NOT_STARTED, icon: 'pause' },
        { label: 'In progress', value: Status.IN_PROGRESS, icon: 'play_arrow' },
        { label: 'Completed', value: Status.COMPLETED, icon: 'verified' },
    ];

    public show(task?: Task) {
        if (task) {
            this.task = JSON.parse(JSON.stringify(task));
            this.edit = true;
        } else {
            this.task.createdAt = new Date().toString();
            this.task.updatedAt = new Date().toString();
            this.task.dueDate = new Date().toString();
            this.task.id = this.firebaseService.generateId();
        }
        this.showModal = true;
        // detect changes
        this.changeDetectorRef.detectChanges();
    }

    save() {
        if (this.edit) {
            this.task.updatedAt = new Date().toString();
        }

        this.onSave.emit(this.task);
        this.close();
    }

    close(): void {
        this.showModal = false;
        this.task = new Task();
        this.edit = false;
    }
}
