import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Login, Register } from './interfaces/Kanban.interfaces';
import { signOut } from 'firebase/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private auth: Auth) { }

    register({ username, email, password }: Register) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }

    login({ email, password }: Login) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    logout() {
        return signOut(this.auth);
    }

    isLoggedIn(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.auth.onAuthStateChanged((user) => {
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    googleLogin() {
        return signInWithPopup(this.auth, new GoogleAuthProvider());
    }
}
