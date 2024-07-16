import {Injectable} from '@angular/core';
import {Login, Register} from '../../app/interfaces/Kanban.interfaces';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User,
    onAuthStateChanged
} from 'firebase/auth';
import firebase, {initializeApp} from "firebase/app";
import {CanActivate, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate{
    firebaseConfig = {
        projectId: 'materialkanban',
        appId: '1:465319731998:web:d609103c2889d47ab21f0f',
        databaseURL: 'https://materialkanban-default-rtdb.europe-west1.firebasedatabase.app',
        storageBucket: 'materialkanban.appspot.com',
        locationId: 'europe-west',
        apiKey: 'AIzaSyDbMsn2lDp8IQvtoEoTIGVlUyGKwhfsCvI',
        authDomain: 'materialkanban.firebaseapp.com',
        messagingSenderId: '465319731998',
        measurementId: 'G-LHTKBGT4VW',
    };
    app = initializeApp(this.firebaseConfig);
    auth = getAuth(this.app);

    constructor(
        private router: Router
    ) {
    }

    async register({username, email, password}: Register) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            let user = userCredential.user;
            await this.auth.updateCurrentUser(user);
            return user;
        } catch (error: any) {
            return error;
        }
    }

    login({email, password}: Login) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    logout() {
        return signOut(this.auth);
    }

    isLoggedIn(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.auth.onAuthStateChanged((user) => {
                localStorage.setItem('uid', user!.uid);
                resolve(user);
            });
        });
    }

    googleLogin() {
        return signInWithPopup(this.auth, new GoogleAuthProvider());
    }

    async canActivate(): Promise<boolean> {
        if (await this.isLoggedIn()) {
            return true;
        } else {
            await this.router.navigate(['/login']);
            return false;
        }
    }
}
