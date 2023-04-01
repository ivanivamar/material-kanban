import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Login } from 'src/app/interfaces/Kanban.interfaces';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass'],
    providers: [AuthService],
})
export class LoginComponent implements OnInit {
    loginForm: Login = {
        email: '',
        password: '',
    };

    constructor(
        private auth: AuthService,
        private router: Router,
    ) { }

    ngOnInit(): void {
    }

    login() {
        this.auth.login({
            email: this.loginForm.email,
            password: this.loginForm.password,
        }).then((user) => {
            console.log('user', user);
            this.router.navigate(['/dashboard']);
        }).catch((error) => {
            console.log('error', error);
        });
    }

    loginWithGoogle() {
        this.auth.googleLogin().then((user) => {
            console.log('user', user);
            this.router.navigate(['/dashboard']);
        }).catch((error) => {
            console.log('error', error);
        });
    }
}
