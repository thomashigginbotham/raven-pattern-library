import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';

import { appRoutes } from '../app.routes';

import { CustomPageComponent } from './custom-page.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { PageContentComponent } from '../page-content/page-content.component';
import { TypographyComponent } from '../typography/typography.component';
import { TypeListComponent } from '../type-list/type-list.component';
import { ColorComponent } from '../color/color.component';
import { ColorListComponent } from '../color-list/color-list.component';
import { ButtonsComponent } from '../buttons/buttons.component';
import { ButtonListComponent } from '../button-list/button-list.component';
import { ButtonListItemComponent }
  from '../button-list-item/button-list-item.component';
import { FormsComponent } from '../forms/forms.component';
import { FormListComponent } from '../form-list/form-list.component';
import { TablesComponent }
  from '../tables/tables.component';
import { TableListComponent } from '../table-list/table-list.component';
import { ComponentLoaderComponent }
  from '../component-loader/component-loader.component';
import { ComponentListComponent } from '../component-list/component-list.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { PageLoaderComponent } from '../page-loader/page-loader.component';
import { PrismComponent } from '../prism/prism.component';

import { UtilsService } from '../utils.service';
import { SafeHtmlPipe } from '../shared/safehtml.pipe';

describe('CustomPageComponent', () => {
  let component: CustomPageComponent;
  let fixture: ComponentFixture<CustomPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomPageComponent,
        PageHeaderComponent,
        PageContentComponent,
        TypographyComponent,
        TypeListComponent,
        ColorComponent,
        ColorListComponent,
        ButtonsComponent,
        ButtonListComponent,
        ButtonListItemComponent,
        FormsComponent,
        FormListComponent,
        TablesComponent,
        TableListComponent,
        ComponentLoaderComponent,
        ComponentListComponent,
        ComponentItemComponent,
        PageLoaderComponent,
        PrismComponent,
        SafeHtmlPipe
      ],
      imports: [
        RouterModule.forRoot(appRoutes)
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
