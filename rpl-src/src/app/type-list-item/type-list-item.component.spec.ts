import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeListItemComponent } from './type-list-item.component';

describe('TypeListItemComponent', () => {
  let component: TypeListItemComponent;
  let fixture: ComponentFixture<TypeListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
