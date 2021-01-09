import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtmsGridV2Component } from './rtms-grid-v2.component';

describe('RtmsGridV2Component', () => {
  let component: RtmsGridV2Component;
  let fixture: ComponentFixture<RtmsGridV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtmsGridV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtmsGridV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
