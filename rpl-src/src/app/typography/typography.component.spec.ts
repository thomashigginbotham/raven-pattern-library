import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypographyComponent } from './typography.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { TypeListComponent } from '../type-list/type-list.component';
import { TypeListItemComponent } from '../type-list-item/type-list-item.component';

import { UtilsService } from '../utils.service';

describe('TypographyComponent', () => {
  let component: TypographyComponent;
  let fixture: ComponentFixture<TypographyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TypographyComponent,
        PageHeaderComponent,
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
    fixture = TestBed.createComponent(TypographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
