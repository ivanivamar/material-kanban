import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {
    transform(value: string, transformType: string): string {
        if (transformType === 'capitalize') {
            // Capitalize the first letter of each word in the input string
            return value
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        } else if (transformType === 'uppercase') {
            // Convert the input string to uppercase
            return value.toUpperCase();
        } else if (transformType === 'lowercase') {
            // Convert the input string to lowercase
            return value.toLowerCase();
        }
        // You can add more transformation options here if needed
        return value;
    }
}
