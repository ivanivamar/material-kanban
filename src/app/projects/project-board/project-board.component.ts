import {Component, inject, Input, OnInit} from '@angular/core';
import {Project, Status, Task} from '../../../modules/project';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TaskCardComponent} from './task-card/task-card.component';
import {FirebaseServiceService} from '../../../services/firebase-service.service';

@Component({
    selector: 'app-project-board',
    standalone: true,
    imports: [
        DragDropModule,
        TaskCardComponent
    ],
    templateUrl: './project-board.component.html',
    styleUrl: './project-board.component.css'
})
export class ProjectBoardComponent implements OnInit {
    @Input() project: Project = new Project();

    private firebaseService: FirebaseServiceService = inject(FirebaseServiceService);

    notStartedTasks: Task[] = [];
    inProgressTasks: Task[] = [];
    completedTasks: Task[] = [];

    protected readonly Status = Status;

    ngOnInit() {
        this.notStartedTasks = this.project.tasks.filter(task => task.status === Status.NOT_STARTED);
        this.inProgressTasks = this.project.tasks.filter(task => task.status === Status.IN_PROGRESS);
        this.completedTasks = this.project.tasks.filter(task => task.status === Status.COMPLETED);
    }

    drop(event: CdkDragDrop<Task[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );

            // update the status of the task
            const task = event.container.data[event.currentIndex];
            task.status = event.container.id as Status;
        }

        this.firebaseService.saveProject(this.project);
    }
}
