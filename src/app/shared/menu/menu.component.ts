import {Component, ElementRef, Input} from '@angular/core';
import {RippleDirective} from '../ripple.directive';

@Component({
    host: {
        '(document:click)': 'toggleMenu($event)',
    },
    selector: 'app-menu',
    standalone: true,
    imports: [
        RippleDirective
    ],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css'
})
export class MenuComponent {
    @Input() items: MenuItem[] = [];
    @Input() position = 'right';

    showMenu = false;

    constructor(
        private _eref: ElementRef
    ) {
    }

    toggleMenu(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.showMenu = false;
        } else {
            this.showMenu = !this.showMenu;
        }
    }
}

export interface MenuItem {
    title: string,
    icon?: string,
    action: () => void,
}
