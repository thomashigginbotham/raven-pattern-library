import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy }
  from '@angular/core';

import { WebComponent } from './component.model';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: [
    './component-list.component.css',
  ]
})
export class ComponentListComponent implements OnInit, OnDestroy {
  private _list: string;
  @ViewChild('wrapper') wrapper: ElementRef;
  wrapperCssClass: string = 'component-list';
  webComponents: WebComponent[];

  get list(): string {
    return this._list;
  }

  @Input()
  set list(value: string) {
    if (typeof this._list !== 'undefined') {
      // Allow user scripts to clean up old components
      this.runUserScripts({ destroy: true });
    }

    this._list = value;

    this.bindComponents()
      .then(components => {
        if (components && components.length) {
          setTimeout(() => {
            this.runUserScripts();
          }, 0);
        }
      });
  }

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    // Allow user scripts to run possible clean-up
    this.runUserScripts({ destroy: true });
  }

  /**
   * Clears the current web components, then gets new ones from the list
   * property.
   */
  bindComponents(): Promise<WebComponent[]> {
    if (!this.list || this.list.length === 0) {
      return Promise.resolve(null);
    }

    const componentPromises: Promise<WebComponent>[] = [];
    this.webComponents = [];

    this.list.split(',').forEach(name => {
      const componentId = name.trim();

      componentPromises.push(this.getComponent(componentId));
    });

    return Promise.all(componentPromises).then(webComponents => {
      this.webComponents = webComponents;

      return webComponents;
    });
  }

  /**
   * Returns a WebComponent object based on its HTML content.
   * @param id An identifier for the component.
   */
  getComponent(id: string): Promise<WebComponent> {
    return new Promise((resolve, reject) => {
      const basePath = 'assets/ext/html/components';
      const path = `${basePath}/${id}.html`;

      this.getComponentHtml(path).then(html => {
        const commentData = this._utilsService.getCommentData(html);

        this.embedDependencies(
          html,
          commentData['depends'],
          basePath
        ).then(htmlWithDependencies => {
          resolve({
            id,
            name: commentData['name'],
            summary: commentData['summary'],
            depends: commentData['depends'],
            html: this.stripComponentComments(html),
            demoHtml: htmlWithDependencies
          });
        });
      });
    });
  }

  /**
   * Returns the HTML content of a component.
   * @param path The path to the HTML file.
   */
  getComponentHtml(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(path).then(response => {
        response.text().then(text => resolve(text));
      });
    });
  }

  /**
   * Embeds content from other files at the beginning of HTML content. The
   * embedded content is wrapped in a DIV with a HIDDEN attribute.
   * @param html The HTML importing the dependencies.
   * @param depends File paths of the dependencies relative to a base path.
   * @param basePath The base path of the dependencies.
   */
  embedDependencies(
    html: string,
    depends: string[],
    basePath: string
  ): Promise<string> {
    if (!depends || depends.length === 0) {
      return Promise.resolve(html);
    }

    const fullPaths = depends
      .map(path => this._utilsService.resolveRelativePath(basePath, path));

    return new Promise((resolve) => {
      const fetches = fullPaths.map(x => fetch(x));
      const responses = fetches.map(x => x.then(response => response.text()));

      Promise.all(responses).then(texts => {
        texts.reverse().forEach(text => {
          html = `<div hidden>${text}</div>${html}`;
        });

        resolve(html);
      });
    });
  }

  /**
   * Returns a string with the component comments removed.
   * @param html The HTML to use.
   */
  stripComponentComments(html: string): string {
    const noComments = html.replace(/<!--[\s\S]+?-->/, '');

    return noComments.trim();
  }

  /**
   * Executes script in config's initComponentsScript value.
   * @param options Options related to user scripts.
   * @param options.destroy Whether to run destruction scripts instead of
   *                        initialization scripts.
   */
  runUserScripts(options: { destroy: boolean } = null) {
    this._utilsService.getRplConfig()
      .then(config => {
        const userScript = (options && options.destroy) ?
         config.destroyComponentsScript :
         config.initComponentsScript;
        const runWhenReady = () => {
          if (
            !window['RavenPatternLibrary'] ||
            !window['RavenPatternLibrary'].userScriptsLoaded
          ) {
            if (tryLimit > 0) {
              setTimeout(runWhenReady, 100);
              tryLimit--;
            }

            return;
          }

          setTimeout(() => eval(userScript), 0);
        };
        let tryLimit = 50;

        runWhenReady();
      });
  }
}
