import {Component, OnInit} from '@angular/core';
import {FirebaseAuthServiceService} from '../../services/firebase-auth-service.service';
import {Router} from '@angular/router';
import {RippleDirective} from '../shared/ripple.directive';
import {globalUser} from '../../constants/enviroment';

@Component({
  selector: 'app-authenticate',
  standalone: true,
    imports: [
        RippleDirective
    ],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css'
})
export class AuthenticateComponent implements OnInit {

    constructor(
        private firebaseAuthService: FirebaseAuthServiceService,
        private router: Router
    ) { }

    ngOnInit(): void {
        if (globalUser?.uid) {
            this.router.navigate(['/projects']);
        }
    }

    login() {
        this.firebaseAuthService.googleLogin().then(r => {
            this.router.navigate(['/projects']);
        });
    }
}
