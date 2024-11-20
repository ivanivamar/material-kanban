import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {globalUser} from "../constants/enviroment";
import {NavbarComponent} from './shared/navbar/navbar.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'material-kanban';
    protected readonly globalUser = globalUser;
}
