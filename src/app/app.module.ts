import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {environment} from 'src/environments/environment';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';
import {KanbanBoardComponent} from './kanban-board/kanban-board.component';
import {KanbanDashboardComponent} from './kanban-dashboard/kanban-dashboard.component';
import {SidebarComponent} from './common/sidebar/sidebar.component';
import {HttpClientModule} from '@angular/common/http';
import {ChartModule} from 'primeng/chart';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule as DragDropModulePrime} from 'primeng/dragdrop';
import {provideStorage, getStorage} from '@angular/fire/storage';
import {CardComponent} from './common/card/card.component';
import {NavbarComponent} from './common/navbar/navbar.component';
import {provideAuth, getAuth, AuthModule} from '@angular/fire/auth';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {CalendarModule} from 'primeng/calendar';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ChipModule} from 'primeng/chip';
import {ToastModule} from 'primeng/toast';
import {PickListModule} from 'primeng/picklist';
import {KanbanTimelineComponent} from './kanban-board/kanban-calendar/kanban-timeline.component';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ProjectsComponent} from './projects/projects.component';
import {RippleDirective} from './ripple.directive';
import {MatDropdownComponent} from './common/mat-dropdown/mat-dropdown.component';
import {MatInputComponent} from './common/mat-input/mat-input.component';
import {MatTextareaComponent} from './common/mat-textarea/mat-textarea.component';
import {DragScrollModule} from "ngx-drag-scroll";
import { OrganizationsComponent } from './organizations/organizations.component';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        KanbanDashboardComponent,
        ProjectsComponent,
        KanbanBoardComponent,
        CardComponent,
        NavbarComponent,
        RegisterComponent,
        LoginComponent,
        KanbanTimelineComponent,
        RippleDirective,
        MatDropdownComponent,
        MatInputComponent,
        MatTextareaComponent,
        OrganizationsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ChartModule,
        DragDropModule,
        AuthModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
        provideAuth(() => getAuth()),
        HttpClientModule,
        DropdownModule,
        MultiSelectModule,
        BrowserAnimationsModule,
        DragDropModulePrime,
        CalendarModule,
        ConfirmPopupModule,
        ChipModule,
        ToastModule,
        PickListModule,
        SelectButtonModule,
        DragScrollModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
