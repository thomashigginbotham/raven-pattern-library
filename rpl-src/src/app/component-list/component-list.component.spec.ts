import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentListComponent } from './component-list.component';
import { ComponentItemComponent }
  from '../component-item/component-item.component';
import { PrismComponent } from '../prism/prism.component';

import { UtilsService } from '../utils.service';
import { SafeHtmlPipe } from '../shared/safehtml.pipe';

describe('ComponentListComponent', () => {
  let component: ComponentListComponent;
  let fixture: ComponentFixture<ComponentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ComponentListComponent,
        ComponentItemComponent,
        PrismComponent,
        SafeHtmlPipe
      ],
      providers: [
        UtilsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
