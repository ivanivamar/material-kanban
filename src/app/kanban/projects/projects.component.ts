import {Component, OnInit, ViewChild} from '@angular/core';
import {Project} from '../../../modules/project';
import {FirebaseServiceService} from '../../../services/firebase-service.service';
import {CreateProjectComponent} from '../create-project/create-project.component';
import {MenuComponent, MenuItem} from '../../shared/menu/menu.component';
import {ProjectBoardComponent} from './project-board/project-board.component';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [
        CreateProjectComponent,
        MenuComponent,
        ProjectBoardComponent
    ],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.sass',
    providers: [FirebaseServiceService]
})
export class ProjectsComponent implements OnInit {
    projects: Project[] = [];
    selectedProject: Project = new Project();

    creatingProject = false;
    menuItems: MenuItem[] = [
        {
            title: 'Rename Project',
            icon: 'edit',
            action: () => {
                console.log('Rename Project');
            }
        },
        {
            title: 'Delete Project',
            icon: 'delete',
            action: () => {
                this.firebaseService.deleteProject(this.selectedProject.id).then(() => {
                    this.getProjects();
                });
            }
        }
    ];

    constructor(
        private firebaseService: FirebaseServiceService
    ) {
    }

    ngOnInit() {
        this.getProjects();
    }

    async getProjects() {
        this.projects = await this.firebaseService.getProjects();
        if (this.projects.length > 0) {
            this.selectedProject = this.projects[0];
        }
    }

    totalProjectTasks(project: Project): number {
        return project.columns.reduce((acc, column) => acc + column.tasks.length, 0);
    }
}
