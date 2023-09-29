import {Pipe, PipeTransform} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";

@Pipe({
    name: 'localize',
})
export class LocalizePipe implements PipeTransform {

    constructor(private auth: AuthService) {
    }

    ngOnInit() {
        console.log('LocalizePipe init');
    }

    transform(value: unknown, ...args: unknown[]): unknown {
        return null;
    }

}
