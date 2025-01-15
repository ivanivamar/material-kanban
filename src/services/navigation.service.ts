import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Project} from '../modules/project';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private origin = new BehaviorSubject<any>(null);
    currentOrigin = this.origin.asObservable();

    private selectedProject = new BehaviorSubject<Project>(new Project());
    currentSelectedProject = this.selectedProject.asObservable();

    private refresh = new BehaviorSubject<boolean>(false);
    currentRefreshProjects = this.refresh.asObservable();

    updateOrigin(origin: any) {
        this.origin.next(origin);
    }

    updateSelectedProject(project: Project) {
        if (project.id === '') {
            return;
        }
        this.selectedProject.next(project);
    }

    refreshProjects(refresh: boolean) {
        this.refresh.next(refresh);
    }
}
