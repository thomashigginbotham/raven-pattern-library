import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorComponent } from './color.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { ColorListComponent } from '../color-list/color-list.component';

describe('ColorComponent', () => {
  let component: ColorComponent;
  let fixture: ComponentFixture<ColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColorComponent,
        PageHeaderComponent,
        ColorListComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
