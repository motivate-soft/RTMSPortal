import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLandingComponent } from './report-landing.component';

describe('ReportLandingComponent', () => {
  let component: ReportLandingComponent;
  let fixture: ComponentFixture<ReportLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
