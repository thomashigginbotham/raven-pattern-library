import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseStylesComponent } from './base-styles.component';

describe('BaseStylesComponent', () => {
  let component: BaseStylesComponent;
  let fixture: ComponentFixture<BaseStylesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseStylesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
