import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';

import { UtilsService } from './utils.service';
import { config } from 'rxjs';

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
    private _activatedRoute: ActivatedRoute,
    private _title: Title,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    // Include user scripts
    this.appendUserStylesAndScripts();

    // Scroll to top after route change
    this._router.events.subscribe((e) => {
      if (!(e instanceof NavigationEnd)) {
        return;
      }

      if (e.urlAfterRedirects.includes('#')) {
        // Don't scroll if URL contains a fragment
        return;
      }

      window.scrollTo(0, 0);
    });

    // Set page title
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this._activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }

          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      ).subscribe(data => this.setPageTitle(data['title']));
  }

  /**
   * Expands or collapses the navigation.
   * @param expand Whether to expand (true) or collapse (false) the navigation.
   */
  expandNav(expand: boolean) {
    this.navIsExpanded = expand;
  }

  /**
   * Updates the page title using a string with format specifiers.
   * @param titleFormat The format of the page's title.
   */
  setPageTitle(titleFormat: string) {
    const uriKey = this._utilsService.getUriLastSegment(this._router);
    let pageTitle = titleFormat;

    this._utilsService.getRplConfig()
      .then(config => {
        const specifierFuncs = {
          'siteTitle': () => config.title,
          'componentTitle': this.getComponentHeading,
          'pageTitle': this.getPageHeading,
          'customPageTitle': this.getCustomPageTitle
        };

        Object.entries(specifierFuncs).forEach(([specifier, func]) => {
          const regex = new RegExp('\\{\\{\\s*' + specifier + '\\s*\\}\\}', 'i');
          const matches = titleFormat.match(regex);

          if (matches) {
            pageTitle = pageTitle
              .replace(matches[0], func.apply(this, [config, uriKey]));
          }
        });

        this._title.setTitle(pageTitle);
      });
  }

  /**
   * Get's a component's heading from its URI key.
   * @param config The RPL configuration object.
   * @param uriKey The component's URI key (as set in config).
   */
  getComponentHeading(config: any, uriKey: string) {
    const curComponent = config.components
      .find(component => component.uriKey === uriKey);

    return curComponent ? curComponent.heading : '';
  }

  /**
   * Returns a page's heading from its URI key.
   * @param config The RPL configuration object.
   * @param uriKey The page's URI key (as set in config).
   */
  getPageHeading(config: any, uriKey: string) {
    const curPage = config.pages
      .find(page => page.uriKey === uriKey);

    return curPage ? curPage.heading : '';
  }

  /**
   * Return's a custom page's title for the current page.
   * @param config The RPL configuration object.
   */
  getCustomPageTitle(config: any) {
    const uriPath = this._utilsService.getUriPath(this._router).toLowerCase();
    let customPage: any = null;

    for (let n = 0; n < config.navigation.length; n++) {
      const item = config.navigation[n];

      if ('/' + item.uri.toLowerCase() === uriPath) {
        customPage = item;
        break;
      }

      if (item['children']) {
        const childItem = item.children
          .find(child => '/' + child.uri.toLowerCase() === uriPath);

        if (childItem) {
          customPage = childItem;
          break;
        }
      }
    }

    return customPage ? customPage.title : '';
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
        ? uri.replace('/js/', 'assets/ext/js/')
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
