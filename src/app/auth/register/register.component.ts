import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
import { Register } from 'src/app/interfaces/Kanban.interfaces';
import {KanbanService} from "../../../shared/services/kanban-service.service";

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
        });

        this.kanbanService.getUsers().subscribe((users) => {
            this.users = users;
        });
    }

    register() {
        this.auth.register({
            username: this.registerForm.username,
            email: this.registerForm.email,
            password: this.registerForm.password,
        }).then((user) => {
            // check if user exists in database
            const userExists = this.users.find((u) => u.uid === user.user.uid);
            if (!userExists) {
                this.kanbanService.addUser(user.user.uid, {
                    uid: user.user.uid,
                    username: user.user.displayName,
                    email: user.user.email,
                    photoURL: user.user.photoURL,
                    sharedProjectsIds: [],
                });
            }
            this.router.navigate(['/auth/login']);
        }).catch((error) => {
            console.log('error', error);
        });
    }
}
