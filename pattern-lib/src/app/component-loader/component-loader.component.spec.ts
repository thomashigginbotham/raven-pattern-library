import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { ComponentLoaderComponent } from './component-loader.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { ComponentListComponent }
  from '../component-list/component-list.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { PrismComponent } from '../prism/prism.component';

import { UtilsService } from '../utils.service';
import { SafeHtmlPipe } from '../shared/safehtml.pipe';

describe('ComponentLoaderComponent', () => {
  let component: ComponentLoaderComponent;
  let fixture: ComponentFixture<ComponentLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ComponentLoaderComponent,
        PageHeaderComponent,
        ComponentListComponent,
        ComponentItemComponent,
        PrismComponent,
        SafeHtmlPipe
      ],
      imports: [
        RouterModule.forRoot([])
      ],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        UtilsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
