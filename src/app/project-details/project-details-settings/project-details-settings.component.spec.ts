import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsSettingsComponent } from './project-details-settings.component';

describe('ProjectDetailsSettingsComponent', () => {
  let component: ProjectDetailsSettingsComponent;
  let fixture: ComponentFixture<ProjectDetailsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailsSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
