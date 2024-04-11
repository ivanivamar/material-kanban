import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IDropdownOption} from 'src/app/interfaces/Kanban.interfaces';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'mat-dropdown',
    templateUrl: './mat-dropdown.component.html',
    styleUrls: ['./mat-dropdown.component.sass']
})
export class MatDropdownComponent implements OnInit {
    @Input() options: any[] = [];
    @Input() optionLabel: string = 'label';
    @Input() optionValue: string = 'value';
    @Input() optionIcon: string = 'icon';
    @Input() placeholder: string = 'Select an Option';
    @Input() value: any = null;
    @Input() disabled: boolean = false;
    @Input() icon: string = '';
    @Input() showClear: boolean = false;
    @Input() returnValue: boolean = false;

    @Output() valueChange = new EventEmitter();

    expanded: boolean = false;
    ngModelLabel: string = '';
    isBottomPage: boolean = false;

    constructor(private _eref: ElementRef) {
    }

    ngOnInit() {
        if (this.value !== null) {
            this.options.forEach((item: any) => {
                if (item[this.optionValue] === this.value) {
                    this.ngModelLabel = item[this.optionLabel];
                }
            });
        }
    }

    onClick(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.expanded = false;
        } else {
            this.expanded = !this.expanded;
            // @ts-ignore
            this.isBottomPage = window.innerHeight - event.clientY < 200;
        }
    }

    selectItem(option: any) {
        this.value = option[this.optionValue];
        console.log('option', option[this.optionValue], this.value);
        this.ngModelLabel = option[this.optionLabel];
        this.valueChange.emit(!this.returnValue ? option : this.value);
        this.expanded = false;
    }

    clear(event: Event) {
        event.stopPropagation();
        this.value = null;
        this.ngModelLabel = '';
    }
}
