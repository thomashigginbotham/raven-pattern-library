import { Routes } from '@angular/router';
import { IntroductionComponent } from './introduction/introduction.component';
import { BaseStylesComponent } from './base-styles/base-styles.component';
import { TypographyComponent } from './typography/typography.component';
import { ColorComponent } from './color/color.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { FormsComponent } from './forms/forms.component';
import { TablesComponent } from './tables/tables.component';
import { ComponentsComponent } from './components/components.component';
import { PageStructureComponent } from './page-structure/page-structure.component';
import { PagesComponent } from './pages/pages.component';

export const appRoutes: Routes = [
  {
    path: 'introduction',
    component: IntroductionComponent
  }, {
    path: 'styles',
    component: BaseStylesComponent
  }, {
    path: 'styles/typography',
    component: TypographyComponent
  }, {
    path: 'styles/color',
    component: ColorComponent
  }, {
    path: 'styles/buttons',
    component: ButtonsComponent
  }, {
    path: 'styles/forms',
    component: FormsComponent
  }, {
    path: 'styles/tables',
    component: TablesComponent
  }, {
    path: 'components',
    component: ComponentsComponent
  }, {
    path: 'components/page-structure',
    component: PageStructureComponent
  }, {
    path: 'pages',
    component: PagesComponent
  }, {
    path: '',
    redirectTo: 'introduction',
    pathMatch: 'full'
  }
];
