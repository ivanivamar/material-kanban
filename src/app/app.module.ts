import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {ProjectDetailsComponent} from './project-details/project-details.component';
import {ProjectsComponent} from './projects/projects.component';
import {SidebarComponent} from './common/sidebar/sidebar.component';
import {ChartModule} from 'primeng/chart';
import {MultiSelectModule} from 'primeng/multiselect';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
import { ProjectDetailsOverviewComponent } from './project-details/project-details-overview/project-details-overview.component';
import {BusyIfDirective} from "./busyif.directive";
import { CountUpModule } from 'ngx-countup';
import { ProjectDetailsSettingsComponent } from './project-details/project-details-settings/project-details-settings.component';
import { ProjectDetailsTasksComponent } from './project-details/project-details-tasks/project-details-tasks.component';
import { MatCalendarComponent } from './common/mat-calendar/mat-calendar.component';
import { TaskComponent } from './project-details/project-details-tasks/task/task.component';
import { DateAgoPipe } from './pipe/date-ago.pipe';
import {ProjectModalComponent} from "./projects/project-modal/project-modal.component";

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
        MatCalendarComponent,
        TaskComponent,
        DateAgoPipe,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ChartModule,
        MultiSelectModule,
        BrowserAnimationsModule,
        CalendarModule,
        ConfirmPopupModule,
        ToastModule,
        RouterLinkActive,
        CountUpModule,
        ProjectModalComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
