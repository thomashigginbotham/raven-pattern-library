import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CustomPageComponent } from './custom-page.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { PageContentComponent } from '../page-content/page-content.component';

import { UtilsService } from '../utils.service';

describe('CustomPageComponent', () => {
  let component: CustomPageComponent;
  let fixture: ComponentFixture<CustomPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomPageComponent,
        PageHeaderComponent,
        PageContentComponent
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
    fixture = TestBed.createComponent(CustomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
