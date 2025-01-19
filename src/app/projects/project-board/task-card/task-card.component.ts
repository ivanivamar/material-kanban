import {Component, Input} from '@angular/core';
import {CdkDragPlaceholder} from "@angular/cdk/drag-drop";
import {Status, Task} from '../../../../modules/project';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';

@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [
        CdkDragPlaceholder,
        Card,
        Tag
    ],
    templateUrl: './task-card.component.html',
    styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
    @Input() task: Task = new Task();

    getSeverity(status: string): any {
        switch (status) {
            case 'Not Started':
                return 'secondary';
            case 'In Progress':
                return 'primary';
            case 'Completed':
                return 'success';
        }

        return 'secondary';
    }
}
