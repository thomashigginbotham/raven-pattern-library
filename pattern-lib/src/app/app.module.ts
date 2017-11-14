import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { UtilsService } from './utils.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { TypographyComponent } from './typography/typography.component';

import { appRoutes } from './app.routes';
import { NavigationComponent } from './navigation/navigation.component';
import { ColorComponent } from './color/color.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { FormsComponent } from './forms/forms.component';
import { TablesComponent } from './tables/tables.component';
import { TypeListComponent } from './type-list/type-list.component';
import { ColorListComponent } from './color-list/color-list.component';
import { FooterComponent } from './footer/footer.component';
import { PageContentComponent } from './page-content/page-content.component';
import { ButtonListComponent } from './button-list/button-list.component';
import { FormListComponent } from './form-list/form-list.component';
import { TableListComponent } from './table-list/table-list.component';
import { ComponentListComponent } from './component-list/component-list.component';

import { SafeHtmlPipe } from './shared/safehtml.pipe';
import { ComponentItemComponent } from './component-item/component-item.component';
import { ComponentLoaderComponent } from './component-loader/component-loader.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { PrismComponent } from './prism/prism.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageHeaderComponent,
    TypographyComponent,
    NavigationComponent,
    ColorComponent,
    ButtonsComponent,
    FormsComponent,
    TablesComponent,
    TypeListComponent,
    ColorListComponent,
    FooterComponent,
    PageContentComponent,
    ButtonListComponent,
    FormListComponent,
    TableListComponent,
    ComponentListComponent,
    SafeHtmlPipe,
    ComponentItemComponent,
    ComponentLoaderComponent,
    PageLoaderComponent,
    CustomPageComponent,
    PrismComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
