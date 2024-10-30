import { Component } from '@angular/core';
import {FirebaseAuthServiceService} from '../../services/firebase-auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css'
})
export class AuthenticateComponent {

    constructor(
        private firebaseAuthService: FirebaseAuthServiceService,
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    login() {
        this.firebaseAuthService.googleLogin().then(r => {
            // navigate to overview
            this.router.navigate(['/overview']);
        });
    }
}
