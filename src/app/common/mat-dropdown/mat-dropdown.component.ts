import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IDropdownOption } from 'src/app/interfaces/Kanban.interfaces';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'mat-dropdown',
    templateUrl: './mat-dropdown.component.html',
    styleUrls: ['./mat-dropdown.component.sass']
})
export class MatDropdownComponent implements OnInit {
    @Input() options: IDropdownOption[] = [];
    @Input() placeholder: string = 'Select an Option';
    @Input() value: any = null;
    @Input() disabled: boolean = false;
    @Input() icon: string = '';
    @Input() showClear: boolean = false;
    @Input() returnValue: boolean = false;

    @Output() valueChange = new EventEmitter();

    expanded: boolean = false;
    ngModelLabel: string = '';

    constructor(private _eref: ElementRef) { }

    ngOnInit() {
        if (this.value !== null) {
            this.options.forEach((item: IDropdownOption) => {
                if (item.value === this.value) {
                    item.selected = true;
                    this.ngModelLabel = item.label;
                }
            });
        }
    }

    onClick(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.expanded = false;
        } else {
            this.expanded = true;
        }
    }

    selectItem(option: IDropdownOption) {
        this.value = option.value;
        this.ngModelLabel = option.label;
        this.valueChange.emit(this.value);
        option.selected = true;

        this.options.forEach((item: IDropdownOption) => {
            if (item.value !== option.value) {
                item.selected = false;
            }
        });

        this.expanded = false;
    }

    clear(event: Event) {
        event.stopPropagation();
        this.value = null;
        this.ngModelLabel = '';
        this.options.forEach((item: IDropdownOption) => {
            item.selected = false;
        });
    }
}
