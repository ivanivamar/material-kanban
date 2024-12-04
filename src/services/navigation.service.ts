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

    updateOrigin(origin: any) {
        this.origin.next(origin);
    }

    updateSelectedProject(project: Project) {
        this.selectedProject.next(project);
    }
}
