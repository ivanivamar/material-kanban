import {Component} from '@angular/core';
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
    providers: [MessageService]
})
export class AppComponent {
    title = 'material-kanban';
    currentYear = new Date().getFullYear();
}
