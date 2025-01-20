import {Component, inject, Input, OnInit} from '@angular/core';
import {Project, Status, Task} from '../../../modules/project';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TaskCardComponent} from './task-card/task-card.component';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {Panel} from 'primeng/panel';
import {NavigationService} from '../../../services/navigation.service';
import {TaskModalComponent} from '../../shared/task-modal/task-modal.component';

@Component({
    selector: 'app-project-board',
    standalone: true,
    imports: [
        DragDropModule,
        TaskCardComponent,
        Panel,
        TaskModalComponent
    ],
    templateUrl: './project-board.component.html',
    styleUrl: './project-board.component.css'
})
export class ProjectBoardComponent implements OnInit {
    private firebaseService: FirebaseServiceService = inject(FirebaseServiceService);
    private navigationService = inject(NavigationService);

    project: Project = new Project();
    notStartedTasks: Task[] = [];
    inProgressTasks: Task[] = [];
    completedTasks: Task[] = [];

    protected readonly Status = Status;

    ngOnInit() {
        this.navigationService.currentSelectedProject.subscribe(project => {
            this.project = project;
            this.notStartedTasks = this.project.tasks.filter(task => task.status === Status.NOT_STARTED);
            this.inProgressTasks = this.project.tasks.filter(task => task.status === Status.IN_PROGRESS);
            this.completedTasks = this.project.tasks.filter(task => task.status === Status.COMPLETED);
        });
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

    refreshProjects() {
        this.navigationService.refreshProjects(true);
    }
}
