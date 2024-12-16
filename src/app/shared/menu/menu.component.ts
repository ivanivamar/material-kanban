import {Component, ElementRef, Input, ViewChild} from '@angular/core';
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
    @ViewChild('menuBtn') menuBtn!: ElementRef;
    @ViewChild('menuContent') menuContent!: ElementRef;

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

            if (this.showMenu) {
                setTimeout(() => {
                    // Set the position of the menu content
                    let menuBtnRect = this.menuBtn.nativeElement.getBoundingClientRect();
                    let menuContentRect = this.menuContent.nativeElement.getBoundingClientRect();
                    let x = menuBtnRect.x;
                    let y = menuBtnRect.y + menuBtnRect.height;
                    let w = menuContentRect.width;
                    let h = menuContentRect.height;
                    // check if the btn is on the top or bottom of the screen
                    if (y + h > window.innerHeight) {
                        y = menuBtnRect.y - h;
                    }

                    if (this.position === 'left') {
                        x = menuBtnRect.x;
                    } else if (this.position === 'right') {
                        x = menuBtnRect.x - w + menuBtnRect.width;
                    } else {
                        console.error('Invalid position value');
                    }

                    this.menuContent.nativeElement.style.left = x + 'px';
                    this.menuContent.nativeElement.style.top = y + 'px';
                    this.menuContent.nativeElement.style.width = w + 'px';
                    this.menuContent.nativeElement.style.height = h + 'px';
                }, 0);
            }
        }
    }
}

export interface MenuItem {
    title: string,
    icon?: string,
    action: () => void,
    divider?: boolean
}
