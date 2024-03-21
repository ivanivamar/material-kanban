export class TableHelper<RowType> {
    totalRecords: number = 0;
    items: RowType[] = [];
    countsPerPage = 9;

    constructor() {
        this.items = [];
    }

    getSkipCount(paginationCount?: number): number {
        if (paginationCount && this.countsPerPage !== paginationCount) {
            return paginationCount;
        }
        return this.countsPerPage;
    }
}
