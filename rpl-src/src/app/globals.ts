import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class Globals {
  paths: {
    config: string,
    customPages: string,
    customStyles: string,
    htmlComponents: string,
    sassVars: string,
    scopedStyles: string,
  };

  constructor() {
    if (environment.production) {
      this.paths = {
        config: '/rpl-assets/rpl-config.json',
        customPages: '/rpl-assets/rpl-pages',
        customStyles: '/rpl-assets/rpl-styles.css',
        htmlComponents: '/html/components',
        sassVars: '/styles/modules/_vars.scss',
        scopedStyles: '/styles/rpl-scoped-styles.css'
      }
    } else {
      this.paths = {
        config: 'assets/rpl-assets/rpl-config.json',
        customPages: 'assets/rpl-assets/rpl-pages',
        customStyles: 'assets/rpl-assets/rpl-styles.css',
        htmlComponents: 'assets/user-assets/html/components',
        sassVars: 'assets/user-assets/styles/modules/_vars.scss',
        scopedStyles: 'assets/user-assets/styles/rpl-scoped-styles.css'
      }
    }
  }
}
