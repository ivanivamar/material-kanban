import {ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Output} from '@angular/core';
import {ModalBaseComponent} from '../ModalBaseComponent';
import {Task} from '../../../modules/project';
import {globalUser} from '../../../constants/enviroment';
import {RippleDirective} from '../ripple.directive';
import {FormsModule} from '@angular/forms';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {Timestamp} from 'firebase/firestore';
import {DatePipe, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-task-modal',
  standalone: true,
    imports: [
        RippleDirective,
        FormsModule,
        JsonPipe,
        DatePipe
    ],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent extends ModalBaseComponent {
    @Output() onSave: EventEmitter<Task> = new EventEmitter();

    private firebaseService = inject(FirebaseServiceService);
    private changeDetectorRef = inject(ChangeDetectorRef);
    task: Task = new Task();

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
