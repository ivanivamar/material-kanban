import {Component, Input} from '@angular/core';
import {Project} from '../../../modules/project';

@Component({
    selector: 'app-project-board',
    imports: [],
    templateUrl: './project-board.component.html',
    styleUrl: './project-board.component.css'
})
export class ProjectBoardComponent {
    @Input() project: Project = new Project();

}
