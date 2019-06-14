import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Globals } from './globals';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageContentComponent } from './page-content/page-content.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TypographyComponent } from './typography/typography.component';
import { TypeListComponent } from './type-list/type-list.component';
import { TypeListItemComponent } from './type-list-item/type-list-item.component';
import { ColorComponent } from './color/color.component';
import { ColorListComponent } from './color-list/color-list.component';
import { ComponentLoaderComponent } from './component-loader/component-loader.component';
import { ComponentListComponent } from './component-list/component-list.component';
import { ComponentItemComponent } from './component-item/component-item.component';
import { PrismComponent } from './prism/prism.component';
import { StickySidebarDirective } from './shared/directives/sticky-sidebar.directive';
import { SafeHtmlPipe } from './shared/safe-html.pipe';
import { SafeStylePipe } from './shared/safe-style.pipe';
import { UrlFragmentScrollerDirective } from './shared/directives/url-fragment-scroller.directive';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { SafeUriPipe } from './shared/safe-uri.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CustomPageComponent,
    PageHeaderComponent,
    PageContentComponent,
    FooterComponent,
    NavigationComponent,
    TypographyComponent,
    TypeListComponent,
    TypeListItemComponent,
    ColorComponent,
    ColorListComponent,
    ComponentLoaderComponent,
    ComponentListComponent,
    ComponentItemComponent,
    PrismComponent,
    StickySidebarDirective,
    SafeHtmlPipe,
    SafeStylePipe,
    UrlFragmentScrollerDirective,
    PageLoaderComponent,
    SafeUriPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
