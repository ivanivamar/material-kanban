import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Task} from '../../../../../modules/project';
import {FirebaseServiceService} from '../../../../../services/firebase-service.service';
import {RippleDirective} from '../../../../shared/ripple.directive';

@Component({
    selector: 'app-task',
    standalone: true,
    imports: [
        RippleDirective
    ],
    templateUrl: './task.component.html',
    styleUrl: './task.component.sass',
    providers: [FirebaseServiceService]
})
export class TaskComponent {
    @Input() task: Task = new Task();
    @Output() updateProject: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private firebaseService: FirebaseServiceService
    ) {
    }

    toggleCompleted(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.task.completed = !this.task.completed;
        this.updateProject.emit();
    }
}
