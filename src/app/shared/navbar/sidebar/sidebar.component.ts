import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Drawer} from "primeng/drawer";
import {RippleDirective} from "../../ripple.directive";
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Project} from '../../../../modules/project';

@Component({
    selector: 'app-sidebar',
    imports: [
        Drawer,
        RippleDirective,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    @Input() showDrawer: boolean = false;
    @Input() selectedProject: Project | null = null;

    @Output() onHideDrawer: EventEmitter<void> = new EventEmitter<void>();

}
