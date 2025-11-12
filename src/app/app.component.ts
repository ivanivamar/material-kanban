import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoaderComponent} from './loader/loader.component';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'material-kanban';
}
