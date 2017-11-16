import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormListComponent } from './form-list.component';
import { UtilsService } from '../utils.service';
import { PageHeaderComponent } from '../page-header/page-header.component';

describe('FormListComponent', () => {
  let component: FormListComponent;
  let fixture: ComponentFixture<FormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormListComponent,
        PageHeaderComponent
      ],
      providers: [
        UtilsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
