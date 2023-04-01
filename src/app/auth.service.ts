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
        // create user
        return createUserWithEmailAndPassword(this.auth, email, password)
            .then((userCredential: any) => {
                // Signed in
                let user = userCredential.user;
                user.displayName = username;
                this.auth.updateCurrentUser(user);
                // ...
                return user;
            }
            ).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                return error;
            }
            );
    }

    login({ email, password }: Login) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    logout() {
        return signOut(this.auth);
    }

    isLoggedIn(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.auth.onAuthStateChanged((user) => {
                console.log('user', user);
                resolve(user);
            });
        });
    }

    googleLogin() {
        return signInWithPopup(this.auth, new GoogleAuthProvider());
    }
}
