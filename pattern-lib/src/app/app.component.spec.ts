import { TestBed, async } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { appRoutes } from './app.routes';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TypographyComponent } from './typography/typography.component';
import { ColorComponent } from './color/color.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { FormsComponent } from './forms/forms.component';
import { TablesComponent } from './tables/tables.component';
import { ComponentLoaderComponent }
  from './component-loader/component-loader.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { FooterComponent } from './footer/footer.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { TypeListComponent } from './type-list/type-list.component';
import { ColorListComponent } from './color-list/color-list.component';
import { ButtonListComponent } from './button-list/button-list.component';
import { ButtonListItemComponent }
  from './button-list-item/button-list-item.component';
import { FormListComponent } from './form-list/form-list.component';
import { TableListComponent } from './table-list/table-list.component';
import { ComponentListComponent }
  from './component-list/component-list.component';
import { PageContentComponent } from './page-content/page-content.component';
import { ComponentItemComponent }
  from './component-item/component-item.component';
import { PrismComponent } from './prism/prism.component';

import { UtilsService } from './utils.service';

import { SafeHtmlPipe } from './shared/safehtml.pipe';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        NavigationComponent,
        TypographyComponent,
        ColorComponent,
        ButtonsComponent,
        FormsComponent,
        TablesComponent,
        ComponentLoaderComponent,
        PageLoaderComponent,
        CustomPageComponent,
        FooterComponent,
        PageHeaderComponent,
        TypeListComponent,
        ColorListComponent,
        ButtonListComponent,
        ButtonListItemComponent,
        FormListComponent,
        TableListComponent,
        ComponentListComponent,
        PageContentComponent,
        ComponentItemComponent,
        PrismComponent,
        SafeHtmlPipe
      ],
      imports: [
        RouterModule.forRoot(appRoutes),
        FormsModule
      ],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        UtilsService
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));
});
