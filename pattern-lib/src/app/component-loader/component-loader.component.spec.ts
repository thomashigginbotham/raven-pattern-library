import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { appRoutes } from '../app.routes';

import { ComponentLoaderComponent } from './component-loader.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { ComponentListComponent }
  from '../component-list/component-list.component';
import { ComponentItemComponent }
  from '../component-item/component-item.component';
import { PrismComponent } from '../prism/prism.component';
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
import { TablesComponent } from '../tables/tables.component';
import { TableListComponent } from '../table-list/table-list.component';
import { PageLoaderComponent } from '../page-loader/page-loader.component';
import { PageContentComponent } from '../page-content/page-content.component';
import { CustomPageComponent } from '../custom-page/custom-page.component';

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
        PageLoaderComponent,
        PageContentComponent,
        CustomPageComponent,
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
    fixture = TestBed.createComponent(ComponentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
