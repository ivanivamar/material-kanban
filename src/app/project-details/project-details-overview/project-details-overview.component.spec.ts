import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsOverviewComponent } from './project-details-overview.component';

describe('ProjectDetailsOverviewComponent', () => {
  let component: ProjectDetailsOverviewComponent;
  let fixture: ComponentFixture<ProjectDetailsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
