import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Register } from 'src/app/interfaces/Kanban.interfaces';
import {KanbanService} from "../../kanban-service.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.sass'],
    providers: [AuthService, KanbanService],
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
        private kanbanService: KanbanService
    ) { }

    ngOnInit(): void {
        // check if user is logged in
        this.auth.isLoggedIn().then((user: any) => {
            if (user) {
                this.router.navigate(['']);
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
            // push user to collection
            this.kanbanService.addUser(user.user.uid, {
                uid: user.user.uid,
                username: this.registerForm.username,
                email: this.registerForm.email,
                photoURL: user.user.photoURL,
            });
            this.router.navigate(['/auth/login']);
        }).catch((error) => {
            console.log('error', error);
        });
    }
}
