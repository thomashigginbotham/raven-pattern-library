import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeListComponent } from './type-list.component';
import { TypeListItemComponent } from '../type-list-item/type-list-item.component';

import { UtilsService } from '../utils.service';

describe('TypeListComponent', () => {
  let component: TypeListComponent;
  let fixture: ComponentFixture<TypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TypeListComponent,
        TypeListItemComponent
      ],
      providers: [
        UtilsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
