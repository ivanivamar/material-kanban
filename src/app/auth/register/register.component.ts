import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Register } from 'src/app/interfaces/Kanban.interfaces';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.sass'],
    providers: [AuthService],
})
export class RegisterComponent implements OnInit {
    registerForm: Register = {
        username: '',
        email: '',
        password: '',
    };

    constructor(
        private auth: AuthService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        // check if user is logged in
        this.auth.isLoggedIn().then((user: any) => {
            if (user) {
                this.router.navigate(['/dashboard']);
            }
        });
    }

    register() {
        this.auth.register({
            username: this.registerForm.username,
            email: this.registerForm.email,
            password: this.registerForm.password,
        }).then((user) => {
            console.log('user', user);
            this.router.navigate(['/auth/login']);
        }).catch((error) => {
            console.log('error', error);
        });
    }
}
