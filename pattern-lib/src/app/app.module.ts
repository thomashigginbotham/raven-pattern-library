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
import { TypeListComponent } from './type-list/type-list.component';
import { ColorListComponent } from './color-list/color-list.component';
import { FooterComponent } from './footer/footer.component';
import { PageContentComponent } from './page-content/page-content.component';
import { ComponentListComponent } from './component-list/component-list.component';

import { SafeHtmlPipe } from './shared/safehtml.pipe';
import { ComponentItemComponent } from './component-item/component-item.component';
import { ComponentLoaderComponent } from './component-loader/component-loader.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { PrismComponent } from './prism/prism.component';
import { TypeListItemComponent } from './type-list-item/type-list-item.component';
import { SafeUriPipe } from './shared/safe-uri.pipe';
import { StickySidebarDirective } from './shared/directives/sticky-sidebar.directive';
import { UrlFragmentScrollerDirective } from './shared/directives/url-fragment-scroller.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageHeaderComponent,
    TypographyComponent,
    NavigationComponent,
    ColorComponent,
    TypeListComponent,
    ColorListComponent,
    FooterComponent,
    PageContentComponent,
    ComponentListComponent,
    SafeHtmlPipe,
    ComponentItemComponent,
    ComponentLoaderComponent,
    PageLoaderComponent,
    CustomPageComponent,
    PrismComponent,
    TypeListItemComponent,
    SafeUriPipe,
    StickySidebarDirective,
    UrlFragmentScrollerDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      {
        scrollPositionRestoration: 'disabled'
      }
    )
  ],
  providers: [
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
