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
import { IntroductionComponent } from './introduction/introduction.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BaseStylesComponent } from './base-styles/base-styles.component';
import { ColorComponent } from './color/color.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { FormsComponent } from './forms/forms.component';
import { TablesComponent } from './tables/tables.component';
import { ComponentsComponent } from './components/components.component';
import { PageStructureComponent } from './page-structure/page-structure.component';
import { PagesComponent } from './pages/pages.component';
import { TypeListComponent } from './type-list/type-list.component';
import { ColorListComponent } from './color-list/color-list.component';
import { FooterComponent } from './footer/footer.component';
import { PageContentComponent } from './page-content/page-content.component';
import { ButtonListComponent } from './button-list/button-list.component';
import { FormListComponent } from './form-list/form-list.component';
import { TableListComponent } from './table-list/table-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageHeaderComponent,
    TypographyComponent,
    IntroductionComponent,
    NavigationComponent,
    BaseStylesComponent,
    ColorComponent,
    ButtonsComponent,
    FormsComponent,
    TablesComponent,
    ComponentsComponent,
    PageStructureComponent,
    PagesComponent,
    TypeListComponent,
    ColorListComponent,
    FooterComponent,
    PageContentComponent,
    ButtonListComponent,
    FormListComponent,
    TableListComponent
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
