import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';

@Injectable({
    providedIn: 'root'
})
export class FirebaseServiceService {
    firebaseConfig = {
        apiKey: "AIzaSyDbMsn2lDp8IQvtoEoTIGVlUyGKwhfsCvI",
        authDomain: "materialkanban.firebaseapp.com",
        databaseURL: "https://materialkanban-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "materialkanban",
        storageBucket: "materialkanban.appspot.com",
        messagingSenderId: "465319731998",
        appId: "1:465319731998:web:d609103c2889d47ab21f0f",
        measurementId: "G-LHTKBGT4VW"
    };
    app = initializeApp(this.firebaseConfig);
    auth = getAuth(this.app);
    provider = new GoogleAuthProvider();

    constructor() {
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
    //#endregion
}
