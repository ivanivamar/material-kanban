import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTaskModalComponent } from './navbar-task-modal.component';

describe('NavbarTaskModalComponent', () => {
  let component: NavbarTaskModalComponent;
  let fixture: ComponentFixture<NavbarTaskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarTaskModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
