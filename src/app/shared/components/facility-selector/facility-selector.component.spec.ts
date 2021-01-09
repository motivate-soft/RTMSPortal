import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitySelectorComponent } from './facility-selector.component';

describe('FacilitySelectorComponent', () => {
  let component: FacilitySelectorComponent;
  let fixture: ComponentFixture<FacilitySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
