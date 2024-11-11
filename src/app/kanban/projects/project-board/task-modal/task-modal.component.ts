import {Component, Input} from '@angular/core';
import {Subtask, Task} from '../../../../../modules/project';
import {FormsModule} from '@angular/forms';
import {FirebaseServiceService} from '../../../../../services/firebase-service.service';

@Component({
    selector: 'app-task-modal',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './task-modal.component.html',
    styleUrl: './task-modal.component.sass',
    providers: [FirebaseServiceService]
})
export class TaskModalComponent {
    showModal: boolean = false;
    task: Task = new Task();

    constructor(
        private firebaseService: FirebaseServiceService
    ) {
    }

    show(task: Task) {
        this.task = task;
        this.showModal = true;
    }

    addSubtask() {
        this.task.subtasks.push({
            id: this.firebaseService.generateId(),
            description: '',
            completed: false
        });
    }

    removeSubtask(subtask: Subtask) {
        this.task.subtasks = this.task.subtasks.filter(t => t.id !== subtask.id);
    }
}
