import {Component, ElementRef, inject, Input} from '@angular/core';
import {globalUser} from "../../../../constants/enviroment";
import {NgOptimizedImage} from "@angular/common";
import {RippleDirective} from "../../ripple.directive";
import {User} from 'firebase/auth';
import {FirebaseAuthServiceService} from '../../../../services/firebase-auth-service.service';
import {MenuItem} from '../../menu/menu.component';

@Component({
    host: {
        '(document:click)': 'toggleMenu($event)',
    },
    selector: 'app-user-menu',
    standalone: true,
    imports: [
        NgOptimizedImage,
        RippleDirective
    ],
    templateUrl: './user-menu.component.html',
    styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {
    @Input() user: User | null = globalUser;
    private firebaseAuthService = inject(FirebaseAuthServiceService);

    showMenu = false;
    items: MenuItem[] = [
        {
            title: 'Profile',
            icon: 'person',
            action: () => {
                console.log('Profile');
            }
        },
        {
            title: 'Settings',
            icon: 'settings',
            action: () => {
                console.log('Settings');
            }
        },
        {
            title: 'Logout',
            icon: 'logout',
            action: () => {
                this.logout();
            },
            divider: true
        }
    ];

    constructor(
        private _eref: ElementRef
    ) {
    }

    toggleMenu(event: Event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.showMenu = false;
        } else {
            this.showMenu = !this.showMenu;
        }
    }

    logout() {
        this.firebaseAuthService.logout().then(r => {
            window.location.reload();
        })
    }
}
