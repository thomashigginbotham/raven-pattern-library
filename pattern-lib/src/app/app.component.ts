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
    this.appendUserScripts();

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
   * Adds user scripts to <head>.
   */
  appendUserScripts() {
    // Var for user scripts to check if environment is RPL
    window['RavenPatternLibrary'] = {};

    // Create <script> tags for each user script
    this._utilsService.getRplConfig()
      .then(config => {
        if (config.scriptUris && config.scriptUris.length) {
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
      });
  }
}
