import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {RippleDirective} from '../ripple.directive';

@Component({
    host: {
        '(document:click)': 'toggleMenu($event)',
    },
    selector: 'app-dropdown',
    standalone: true,
    imports: [
        RippleDirective
    ],
    templateUrl: './dropdown.component.html',
    styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
    @ViewChild('menuBtn') menuBtn!: ElementRef;
    @ViewChild('menuContent') menuContent!: ElementRef;
    @Input() items: DropdownItem[] = [];
    @Input() label: string = '';
    @Input() value: any;
    @Input() icon: string = '';
    @Input() disabled: boolean = false;
    @Input() required: boolean = false;
    @Input() position = 'right';
    @Output() onChange: EventEmitter<any> = new EventEmitter();

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
                }, 100);
            }
        }
    }

    getLabelOfValue() {
        if (this.value != null && this.value.length > 0) {
            let item = this.items.find(item => item.value == this.value);
            return item ? item.label : '';
        }
        return '';
    }

    getIconOfValue() {
        if (this.icon.length > 0) {
            return this.icon;
        }
        if (this.value != null && this.value.length > 0) {
            let item = this.items.find(item => item.value == this.value);
            return item ? item.icon : '';
        }
        return '';
    }

    public selectItem(item: DropdownItem) {
        this.value = item.value;
        this.onChange.emit(this.value);
    }
}

export interface DropdownItem {
    label: string;
    value: any;
    icon?: string;
}
