import {Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FirebaseServiceService} from '../../../../services/firebase-service.service';
import {Project} from '../../../../modules/project';
import {RippleDirective} from '../../ripple.directive';
import {User} from 'firebase/auth';
import {globalUser} from '../../../../constants/enviroment';
import {ProjectModalComponent} from '../../project-modal/project-modal.component';
import {AsyncPipe} from '@angular/common';
import {MenuComponent, MenuItem} from '../../menu/menu.component';
import {NavigationService} from '../../../../services/navigation.service';

@Component({
    selector: 'app-projects-list',
    standalone: true,
    imports: [
        RippleDirective,
        ProjectModalComponent,
        AsyncPipe,
        MenuComponent
    ],
    templateUrl: './projects-list.component.html',
    styleUrl: './projects-list.component.sass',
    providers: [FirebaseServiceService]
})
export class ProjectsListComponent implements OnInit {
    @ViewChild(ProjectModalComponent) projectModalComponent!: ProjectModalComponent;
    @Input() user: User | null = globalUser;
    @Output() onSelectedProject: EventEmitter<Project> = new EventEmitter<Project>();
    private firebaseService = inject(FirebaseServiceService);
    private navigationService = inject(NavigationService);

    projects: Project[] = [];
    selectedProject: Project = new Project();
    projectMenuItems: MenuItem[] = [
        { title: 'Edit', action: () => this.projectModalComponent.show(this.selectedProject), icon: 'edit' },
        { title: 'Delete', action: () => this.deleteProject(this.selectedProject), icon: 'delete' }
    ];

    async ngOnInit() {
        await this.getProjects();

        if (this.projects.length > 0) {
            this.selectedProject = this.projects[0];
            this.onSelectedProject.emit(this.selectedProject);
        } else {
            this.selectedProject = new Project();
        }
        console.log('%cSelectedProject', 'color: #ff0000', this.selectedProject);

        this.navigationService.currentRefreshProjects.subscribe(boolean => {
            this.getProjects();
        });
    }

    async getProjects() {
        this.projects = await this.firebaseService.getProjects(this.user!.uid);
    }

    async deleteProject(project: Project) {
        await this.firebaseService.deleteProject(project.id);
        await this.getProjects();
    }
}
