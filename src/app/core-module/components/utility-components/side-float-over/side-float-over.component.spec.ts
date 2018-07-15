import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideFloatOverComponent } from './side-float-over.component';

describe('SideFloatOverComponent', () => {
  let component: SideFloatOverComponent;
  let fixture: ComponentFixture<SideFloatOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideFloatOverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideFloatOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
