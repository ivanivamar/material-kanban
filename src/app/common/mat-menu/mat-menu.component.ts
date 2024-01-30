import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IDropdownOption} from 'src/app/interfaces/Kanban.interfaces';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'mat-menu',
    templateUrl: './mat-menu.component.html',
    styleUrls: ['./mat-menu.component.sass']
})
export class MatMenuComponent {
    expanded: boolean = false;

    constructor(private _eref: ElementRef) {
    }

    onClick(event: Event) {
        event.stopPropagation();
        event.preventDefault();

        if (!this._eref.nativeElement.contains(event.target)) {
            this.expanded = false;
        } else {
            this.expanded = true;
        }
    }

}
