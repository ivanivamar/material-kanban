import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
import { Login } from 'src/app/interfaces/Kanban.interfaces';
import {KanbanService} from "../../../shared/services/kanban-service.service";
import {from} from "rxjs";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass'],
    providers: [AuthService, KanbanService],
})
export class LoginComponent implements OnInit {
    loginForm: Login = {
        email: '',
        password: '',
    };

    users: any[] = [];

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
            from(this.kanbanService.getUsers()).subscribe((users: any[]) => {
                this.users = users;
            });
        });
    }

    login() {
        this.auth.login({
            email: this.loginForm.email,
            password: this.loginForm.password,
        }).then((user) => {
            this.router.navigate(['']);
        }).catch((error) => {
            console.log('error', error);
        });
    }

    loginWithGoogle() {
        this.auth.googleLogin().then((user) => {
            // check if user exists in database
            let userExists = false;
            this.users.forEach((u) => {
                if (u.uid === user.user.uid) {
                    userExists = true;
                }
            });
            if (!userExists) {
                this.kanbanService.addUser(user.user.uid, {
                    uid: user.user.uid,
                    username: user.user.displayName,
                    email: user.user.email,
                    photoURL: user.user.photoURL,
                    sharedProjectsIds: [],
                });
            }
            this.router.navigate(['']);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }).catch((error) => {
            console.log('error', error);
        });
    }
}
