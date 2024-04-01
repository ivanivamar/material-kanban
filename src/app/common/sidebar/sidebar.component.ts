import {KanbanService} from 'src/shared/services/kanban-service.service';
import {ApplicationRef, Component, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.sass'],
    providers: [KanbanService, AuthService],
})
export class SidebarComponent {
    showUserMenu = false;
    user: any;
    theme = 'light-theme';
    themeOptions = [
        {label: 'Light', value: 'light-theme', icon: 'fa-sun'},
        {label: 'Dark', value: 'dark-theme', icon: 'fa-moon'},
        {label: 'System', value: 'system', icon: 'fa-display'},
    ];

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        // get cookie of theme
        const theme = localStorage.getItem('theme');

        if (theme) {
            this.theme = theme;
        } else {
            this.theme = 'light-theme';
            // set theme cookie
            localStorage.setItem('theme', this.theme);
        }

        // set html class
        if (this.theme != 'system') {
            document.querySelector('html')?.classList.add(this.theme);
        } else {
            this.checkDarkMode();
        }
    }

    getThemeIcon() {
        if (this.theme == 'system') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'fa-moon';
            } else {
                return 'fa-sun';
            }
        } else {
            return this.themeOptions.find((option) => option.value == this.theme)?.icon;
        }
    }

    checkDarkMode() {
        document.querySelector('html')?.classList.remove('dark-theme', 'light-theme');
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.querySelector('html')?.classList.add('dark-theme');
        } else {
            document.querySelector('html')?.classList.add('light-theme');
        }
    }

    // check when scroll down
    @HostListener('window:scroll', ['$event.target'])
    onScroll(event: any) {
        if (event.scrollingElement.scrollTop >= 200) {
            // @ts-ignore
            document.getElementById('navbar').classList.add('navbar-fixed');
            // @ts-ignore
            document.querySelector('main').setAttribute('style', 'margin-top: 88px');
        } else {
            // @ts-ignore
            document.getElementById('navbar').classList.remove('navbar-fixed');
            // @ts-ignore
            document.querySelector('main').setAttribute('style', 'margin-top: 0');
        }
    }

    async ngOnInit(): Promise<void> {

        // check if user is logged in
        this.authService.isLoggedIn().then((user: any) => {
            if (user) {
                this.user = user;
            }
        });
    }

    logout() {
        this.authService.logout()
            .then(() => {
                this.router.navigate(['']);
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }).catch((error) => {
            console.log('error', error);
        });
    }

    navigateTo(projectId: string): void {
        this.router.navigate(['/kanban'], {
            queryParams: {projectId: projectId},
        });
    }

    changeTheme(theme: string) {
        this.theme = theme;
        if (theme != 'system') {
            document.querySelector('html')?.classList.remove('dark-theme', 'light-theme');
            document.querySelector('html')?.classList.add(theme);
        } else {
            this.checkDarkMode();
        }

        // set theme cookie
        localStorage.setItem('theme', this.theme);
    }
}
