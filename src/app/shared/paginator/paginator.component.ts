import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RippleDirective} from '../ripple.directive';
import {DropdownComponent, DropdownItem} from '../dropdown/dropdown.component';

@Component({
  selector: 'app-paginator',
  standalone: true,
    imports: [
        RippleDirective,
        DropdownComponent
    ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {
    @Input() totalCount = 0;
    @Input() rows = 10;
    @Output() pageChange = new EventEmitter<Paginator>();

    paginator: Paginator = {
        minIndex: 0,
        maxIndex: 0
    }
    rowsPerPageOptions: DropdownItem[] = [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '50', value: 50 },
    ];

    ngOnInit() {
        this.paginator.minIndex = 0;
        this.paginator.maxIndex = this.rows;

        this.pageChange.emit(this.paginator);
    }

    previousPage() {
        this.paginator.minIndex -= this.rows;
        this.paginator.maxIndex -= this.rows;

        this.pageChange.emit(this.paginator);
    }

    nextPage() {
        this.paginator.minIndex += this.rows;
        this.paginator.maxIndex += this.rows;

        this.pageChange.emit(this.paginator);
    }

    firstPage() {
        this.paginator.minIndex = 0;
        this.paginator.maxIndex = this.rows;

        this.pageChange.emit(this.paginator);
    }

    lastPage() {
        this.paginator.minIndex = this.totalCount - this.rows;
        this.paginator.maxIndex = this.totalCount;

        this.pageChange.emit(this.paginator);
    }

    isPreviousDisabled() {
        return this.paginator.minIndex === 0;
    }

    isNextDisabled() {
        return this.paginator.maxIndex >= this.totalCount;
    }
}

export interface Paginator {
    minIndex: number;
    maxIndex: number;
}
