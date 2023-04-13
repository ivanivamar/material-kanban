import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerSectionLink } from 'src/app/interfaces/Kanban.interfaces';

@Component({
  selector: 'navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrls: ['./navigation-drawer.component.sass']
})
export class NavigationDrawerComponent {
    @Input() sectionLinks: DrawerSectionLink[] = [];
    @Input() open: boolean = false;

    @Output() closeDrawer: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private router: Router,
    ) { }

    navigateTo(sectionLink: DrawerSectionLink): void {
        this.router.navigate([sectionLink.route], {
            queryParams: sectionLink.params
        });
    }

    sendCloseDrawer() {
        this.closeDrawer.emit();
    }
}
