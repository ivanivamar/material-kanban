export class TableHelper<RowType> {
    totalRecords: number = 0;
    items: RowType[] = [];
    countsPerPage = 10;
    predefinedRecordsCountPerPage = [5, 10, 25, 50];
    currentPage = 1;

    constructor() {
        this.items = [];
    }
}
