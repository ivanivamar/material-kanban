import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanDashboardComponent } from './kanban-dashboard.component';

describe('KanbanDashboardComponent', () => {
  let component: KanbanDashboardComponent;
  let fixture: ComponentFixture<KanbanDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
