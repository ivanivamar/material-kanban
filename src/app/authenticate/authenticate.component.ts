import {Component, OnInit} from '@angular/core';
import {FirebaseAuthServiceService} from '../../services/firebase-auth-service.service';
import {Router} from '@angular/router';
import {RippleDirective} from '../shared/ripple.directive';

@Component({
    selector: 'app-authenticate',
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
        const localUser = localStorage.getItem('user');

        if (localUser !== null) {
            this.router.navigate(['/projects']);
        }
    }

    login() {
        this.firebaseAuthService.googleLogin().then(r => {
            this.router.navigate(['/projects']).then(r => {
                console.log(r);
            });
        });
    }
}
