import {Component, Input} from '@angular/core';
import {RippleDirective} from '../../shared/ripple.directive';
import {Project} from '../../../modules/project';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
    selector: 'app-project-sidebar',
    imports: [
        RippleDirective,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './project-sidebar.component.html',
    styleUrl: './project-sidebar.component.css'
})
export class ProjectSidebarComponent {
    @Input() project: Project = new Project();

}
