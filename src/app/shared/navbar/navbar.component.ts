import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FirebaseAuthServiceService} from '../../../services/firebase-auth-service.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

    constructor(
        private firebaseAuthService: FirebaseAuthServiceService
    ) {
    }

    logout() {
        this.firebaseAuthService.logout().then(r => {
            window.location.reload();
        })
    }
}
