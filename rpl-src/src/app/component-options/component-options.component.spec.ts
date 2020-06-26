import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentOptionsComponent } from './component-options.component';

describe('ComponentOptionsComponent', () => {
  let component: ComponentOptionsComponent;
  let fixture: ComponentFixture<ComponentOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
