import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentPagerComponent } from './resident-pager.component';

describe('ResidentPagerComponent', () => {
  let component: ResidentPagerComponent;
  let fixture: ComponentFixture<ResidentPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidentPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
