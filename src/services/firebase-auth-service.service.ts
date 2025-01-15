import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import {app} from '../constants/enviroment';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthServiceService {
    auth = getAuth(app);
    provider = new GoogleAuthProvider();

    constructor(
        private router: Router
    ) {
    }

    // #region Auth
    googleLogin() {
        return signInWithPopup(this.auth, new GoogleAuthProvider());
    }

    isLoggedIn(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.auth.onAuthStateChanged((user) => {
                resolve(user);
            });
        });
    }

    logout() {
        return signOut(this.auth);
    }

    async canActivate(): Promise<boolean> {
        if (await this.isLoggedIn()) {
            return true;
        } else {
            await this.router.navigate(['/authenticate']);
            return false;
        }
    }
    //#endregion
}
