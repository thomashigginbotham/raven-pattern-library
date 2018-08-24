import { Routes } from '@angular/router';
import { TypographyComponent } from './typography/typography.component';
import { ColorComponent } from './color/color.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { ComponentLoaderComponent } from './component-loader/component-loader.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { CustomPageComponent } from './custom-page/custom-page.component';

export const appRoutes: Routes = [
  {
    path: 'styles/typography',
    component: TypographyComponent
  }, {
    path: 'styles/color',
    component: ColorComponent
  }, {
    path: 'styles/buttons',
    component: ButtonsComponent
  }, {
    path: 'components/:id',
    component: ComponentLoaderComponent
  }, {
    path: 'pages/:id',
    component: PageLoaderComponent
  }, {
    path: ':id',
    component: CustomPageComponent
  }, {
    path: ':parentId/:id',
    component: CustomPageComponent
  }, {
    path: '',
    redirectTo: 'introduction',
    pathMatch: 'full'
  }
];
