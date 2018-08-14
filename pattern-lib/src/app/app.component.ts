import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { UtilsService } from './utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})
export class AppComponent implements OnInit {
  navIsExpanded: boolean = false;

  constructor(
    private _router: Router,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    // Include user scripts
    this.appendUserStylesAndScripts();

    // Scroll to top after route change
    this._router.events.subscribe(e => {
      if (!(e instanceof NavigationEnd)) {
        return;
      }

      window.scrollTo(0, 0);
    });
  }

  /**
   * Expands or collapses the navigation.
   * @param expand Whether to expand (true) or collapse (false) the navigation.
   */
  expandNav(expand: boolean) {
    this.navIsExpanded = expand;
  }

  /**
   * Adds user style sheets and scripts to <head>.
   */
  appendUserStylesAndScripts() {
    this._utilsService.getRplConfig()
      .then(config => {
        if (config.styleUris && config.styleUris.length) {
          this.appendUserStyles(config);
        }

        if (config.scriptUris && config.scriptUris.length) {
          this.appendUserScripts(config);
        }
      });
  }

  /**
   * Adds user style sheets to <head>.
   * @param config The RPL configuration to use.
   */
  appendUserStyles(config: any) {
    const addStyleSheet = (uri: string) => {
      const linkEl = document.createElement('link');
      const headEl = document.getElementsByTagName('head')[0];

      linkEl.rel = 'stylesheet';
      linkEl.href = uri;

      headEl.appendChild(linkEl);
    };

    config.styleUris.forEach(uri => {
      addStyleSheet(uri);
    });
  }

  /**
   * Adds user scripts to <head>.
   * @param config The RPL configuration to use.
   */
  appendUserScripts(config: any) {
    // Var for user scripts to check if environment is RPL
    window['RavenPatternLibrary'] = {};

    // Create <script> tags for each user script
    const addScript = (uri: string) => {
      const scriptEl = document.createElement('script');
      const headEl = document.getElementsByTagName('head')[0];
      const revisedUri = uri.startsWith('/js/')
        ? uri.replace('/js/', '/assets/ext/js/')
        : uri;

      scriptEl.src = revisedUri;

      if (config.scriptUris.length > 0) {
        scriptEl.onload = () => addScript(config.scriptUris.shift());
      } else {
        scriptEl.onload = () => {
          window['RavenPatternLibrary'].userScriptsLoaded = true;
        }
      }

      headEl.appendChild(scriptEl);
    }

    addScript(config.scriptUris.shift());
  }
}
