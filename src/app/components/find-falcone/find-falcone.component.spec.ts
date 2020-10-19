import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindFalconeComponent } from './find-falcone.component';

describe('FindFalconeComponent', () => {
  let component: FindFalconeComponent;
  let fixture: ComponentFixture<FindFalconeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindFalconeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindFalconeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
