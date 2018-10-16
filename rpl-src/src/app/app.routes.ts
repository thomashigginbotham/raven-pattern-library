import { Routes } from '@angular/router';
import { TypographyComponent } from './typography/typography.component';
import { ColorComponent } from './color/color.component';
import { ComponentLoaderComponent } from './component-loader/component-loader.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { CustomPageComponent } from './custom-page/custom-page.component';

export const appRoutes: Routes = [
  {
    path: 'styles/typography',
    component: TypographyComponent,
    data: { title: 'Typography | {{ siteTitle }}'}
  }, {
    path: 'styles/color',
    component: ColorComponent,
    data: { title: 'Color | {{ siteTitle }}'}
  }, {
    path: 'components/:id',
    component: ComponentLoaderComponent,
    data: { title: '{{ componentTitle }} | {{ siteTitle }}'}
  }, {
    path: 'pages/:id',
    component: PageLoaderComponent,
    data: { title: '{{ pageTitle }} | {{ siteTitle }}'}
  }, {
    path: ':id',
    component: CustomPageComponent,
    data: { title: '{{ customPageTitle }} | {{ siteTitle }}'}
  }, {
    path: ':parentId/:id',
    component: CustomPageComponent,
    data: { title: '{{ customPageTitle }} | {{ siteTitle }}'}
  }, {
    path: '',
    redirectTo: 'introduction',
    pathMatch: 'full'
  }
];
