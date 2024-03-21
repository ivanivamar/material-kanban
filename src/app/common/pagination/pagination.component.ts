import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.sass']
})
export class PaginationComponent implements AfterViewInit {
    @Input() totalRecordCount: number = 0;
    @Input() rows: number = 0;
    @Output() onPageChange = new EventEmitter<number>();

    currentPage: number = 1;
    firstItemNumber: number = 1;
    lastItemNumber: number = 1;
    pages: number[] = [];

    constructor() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            console.log('totalRecordCount', this.totalRecordCount);
            this.pages = [];
            for (let i = 1; i <= Math.ceil(this.totalRecordCount / this.rows); i++) {
                this.pages.push(i);
            }
            this.calculatePageNumbers();
        }, 1000);
    }

    onPageClicked(pageNumber: number) {
        if (pageNumber == this.currentPage) {
            return;
        }
        this.currentPage = pageNumber;
        this.calculatePageNumbers();
        this.onPageChange.emit(this.currentPage);
    }

    calculatePageNumbers() {
        this.firstItemNumber = (this.currentPage - 1) * this.rows + 1;
        this.lastItemNumber = this.currentPage * this.rows;
        if (this.lastItemNumber > this.totalRecordCount) {
            this.lastItemNumber = this.totalRecordCount;
        }
    }
}
