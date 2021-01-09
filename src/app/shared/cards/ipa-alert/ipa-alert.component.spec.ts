import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IPAAlertComponent } from './ipa-alert.component';

describe('IPAAlertComponent', () => {
  let component: IPAAlertComponent;
  let fixture: ComponentFixture<IPAAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IPAAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IPAAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
