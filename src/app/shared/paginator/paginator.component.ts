import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RippleDirective} from '../ripple.directive';

@Component({
  selector: 'app-paginator',
  standalone: true,
    imports: [
        RippleDirective
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
