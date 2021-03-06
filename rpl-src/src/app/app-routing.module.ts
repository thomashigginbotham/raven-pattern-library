import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypographyComponent } from './typography/typography.component';
import { ColorComponent } from './color/color.component';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { ComponentLoaderComponent } from './component-loader/component-loader.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';

const routes: Routes = [
  {
    path: 'styles/typography',
    component: TypographyComponent,
    data: { title: 'Typography | {{ siteTitle }}' }
  }, {
    path: 'styles/color',
    component: ColorComponent,
    data: { title: 'Color | {{ siteTitle }}' }
  }, {
    path: 'components/:id',
    component: ComponentLoaderComponent,
    data: { title: '{{ componentTitle }} | {{ siteTitle }}' }
  }, {
    path: 'component-variants/:id',
    component: ComponentLoaderComponent,
    data: {
      title: '{{ componentTitle }} | {{ siteTitle }}',
      loadVariants: true,
    }
  }, {
    path: 'pages/:id',
    component: PageLoaderComponent,
    data: { title: '{{ pageTitle }} | {{ siteTitle }}'}
  }, {
    path: ':id',
    component: CustomPageComponent,
    data: { title: '{{ customPageTitle }} | {{ siteTitle }}' }
  }, {
    path: ':parentId/:id',
    component: CustomPageComponent,
    data: { title: '{{ customPageTitle }} | {{ siteTitle }}' }
  }, {
    path: '',
    redirectTo: 'introduction',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
