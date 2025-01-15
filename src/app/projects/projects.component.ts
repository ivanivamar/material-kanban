import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FirebaseServiceService} from '../../services/firebase-service.service';
import {NavigationService} from '../../services/navigation.service';
import {Project, Task} from '../../modules/project';
import {TaskListComponent} from './task-list/task-list.component';
import {Timestamp} from 'firebase/firestore';
import {ProjectSidebarComponent} from './project-sidebar/project-sidebar.component';
import {NgSwitch, NgSwitchCase} from '@angular/common';
import {ProjectSummaryComponent} from './project-summary/project-summary.component';
import {ProjectBoardComponent} from './project-board/project-board.component';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [
        TaskListComponent,
        ProjectSidebarComponent,
        NgSwitch,
        ProjectSummaryComponent,
        NgSwitchCase,
        ProjectBoardComponent
    ],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.sass',
    providers: [FirebaseServiceService]
})
export class ProjectsComponent implements OnInit {
    @ViewChild(TaskListComponent) taskListComponent!: TaskListComponent;
    private firebaseService = inject(FirebaseServiceService);
    private navigationService = inject(NavigationService);
    selectedProject: Project = new Project();
    currentUrlSection = 'summary';

    ngOnInit() {
        this.navigationService.updateOrigin('projects');

        this.navigationService.currentSelectedProject.subscribe(project => {
            this.selectedProject = project;
        });

        if (location.pathname.split('/')[3]) {
            this.currentUrlSection = location.pathname.split('/')[3];
        }
    }

    saveProjectTask(task: Task) {
        let input: Task = {
            id: task.id,
            projectId: this.selectedProject.id,
            name: task.name,
            description: task.description,
            updatedAt: task.updatedAt,
            createdAt: task.createdAt,
            completed: task.completed,
            dueDate: task.dueDate,
            status: task.status,
            subtasks: task.subtasks
        };

        if (this.selectedProject.tasks.find(t => t.id === input.id)) {
            this.selectedProject.tasks = this.selectedProject.tasks.map(t => {
                if (t.id === input.id) {
                    return input;
                }
                return t;
            });
        } else {
            this.selectedProject.tasks.push(input);
        }

        this.selectedProject.updatedAt = new Date().toString();
        this.firebaseService.saveProject(this.selectedProject).then(() => {
            this.navigationService.refreshProjects(true);
            this.taskListComponent.refreshTasks();
        });
    }

    deleteProjectTask(task: Task) {
        this.selectedProject.tasks = this.selectedProject.tasks.filter(t => t.id !== task.id);
        this.selectedProject.updatedAt = new Date().toString();
        this.firebaseService.saveProject(this.selectedProject).then(() => {
            this.navigationService.refreshProjects(true);
        });
    }
}
