import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {environment} from 'src/environments/environment';
import {FormsModule} from '@angular/forms';
import {ProjectDetailsComponent} from './project-details/project-details.component';
import {ProjectsComponent} from './projects/projects.component';
import {SidebarComponent} from './common/sidebar/sidebar.component';
import {HttpClientModule} from '@angular/common/http';
import {ChartModule} from 'primeng/chart';
import {MultiSelectModule} from 'primeng/multiselect';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule as DragDropModulePrime} from 'primeng/dragdrop';
import {provideStorage, getStorage} from '@angular/fire/storage';
import {provideAuth, getAuth, AuthModule} from '@angular/fire/auth';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {CalendarModule} from 'primeng/calendar';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ToastModule} from 'primeng/toast';
import {RippleDirective} from './ripple.directive';
import {MatDropdownComponent} from './common/mat-dropdown/mat-dropdown.component';
import { CircularProgressBarComponent } from './common/circular-progress-bar/circular-progress-bar.component';
import { ProjectMembersComponent } from './project-details/project-members/project-members.component';
import { TaskFiltersComponent } from './project-details/task-filters/task-filters.component';
import { TextTransformPipe } from './pipe/text-transform.pipe';
import {CommonModule} from "@angular/common";
import { RouterLinkActive } from '@angular/router';
import { PaginationComponent } from './common/pagination/pagination.component';
import {RippleModule} from "primeng/ripple";
import { ProjectDetailsOverviewComponent } from './project-details/project-details-overview/project-details-overview.component';
import {BusyIfDirective} from "./busyif.directive";
import { CountUpModule } from 'ngx-countup';
import { ProjectDetailsSettingsComponent } from './project-details/project-details-settings/project-details-settings.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { ProjectDetailsTasksComponent } from './project-details/project-details-tasks/project-details-tasks.component';
import { MatCalendarComponent } from './common/mat-calendar/mat-calendar.component';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        ProjectsComponent,
        ProjectDetailsComponent,
        RegisterComponent,
        LoginComponent,
        RippleDirective,
        MatDropdownComponent,
        CircularProgressBarComponent,
        ProjectMembersComponent,
        TaskFiltersComponent,
        TextTransformPipe,
        PaginationComponent,
        ProjectDetailsOverviewComponent,
        BusyIfDirective,
        ProjectDetailsSettingsComponent,
        ProjectDetailsTasksComponent,
        MatCalendarComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ChartModule,
        AuthModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
        provideAuth(() => getAuth()),
        HttpClientModule,
        MultiSelectModule,
        BrowserAnimationsModule,
        DragDropModulePrime,
        CalendarModule,
        ConfirmPopupModule,
        ToastModule,
        RouterLinkActive,
        RippleModule,
        CountUpModule,
        SweetAlert2Module.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
