import {initializeApp} from 'firebase/app';
import { User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyDbMsn2lDp8IQvtoEoTIGVlUyGKwhfsCvI",
    authDomain: "materialkanban.firebaseapp.com",
    databaseURL: "https://materialkanban-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "materialkanban",
    storageBucket: "materialkanban.appspot.com",
    messagingSenderId: "465319731998",
    appId: "1:465319731998:web:d609103c2889d47ab21f0f",
    measurementId: "G-LHTKBGT4VW"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export let globalUser: User | null = null;
// globalUser setter
export function setGlobalUser(user: User) {
    globalUser = user;
}
