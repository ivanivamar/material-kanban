import {Component, Input} from '@angular/core';
import {CdkDrag, CdkDragPlaceholder, CdkDragPreview} from "@angular/cdk/drag-drop";
import {Task} from '../../../../modules/project';
import {RippleDirective} from '../../../shared/ripple.directive';

@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [
        CdkDrag,
        CdkDragPlaceholder,
        CdkDragPreview,
        RippleDirective
    ],
    templateUrl: './task-card.component.html',
    styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
    @Input() task: Task = new Task();

}
