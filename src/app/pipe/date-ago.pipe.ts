import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {
    transform(value: any): string {
        if (!value) return '';

        const date = new Date(value);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const diffDays = Math.floor(diff / (1000 * 3600 * 24));

        if (diffDays === 0) {
            return 'today';
        } else if (diffDays === 1) {
            return 'yesterday';
        } else {
            return diffDays + ' days ago';
        }
    }
}
