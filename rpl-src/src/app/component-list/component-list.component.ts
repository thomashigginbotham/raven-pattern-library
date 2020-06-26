import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  Input
} from '@angular/core';

import { Globals } from '../globals';
import { WebComponent } from './component.model';
import { UtilsService } from '../utils.service';
import { ComponentItemComponent } from '../component-item/component-item.component';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.css']
})
export class ComponentListComponent implements AfterViewInit, OnDestroy {
  private _list: string;

  @ViewChild('wrapper', { static: false })
  wrapper: ElementRef;

  @ViewChildren('childComponents')
  childComponents: QueryList<ComponentItemComponent>

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
    private _globals: Globals,
    private _utilsService: UtilsService
  ) { }

  ngAfterViewInit() {
    this.setBreakpointClassNames();
  }

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
   * Sets the component breakpoint class names specified by user config.
   */
  setBreakpointClassNames() {
    if (!('ResizeObserver' in window)) {
      return;
    }

    this._utilsService.getRplConfig()
      .then(config => {
        this.childComponents.changes.subscribe(() => {
          const breakpoints = config.styleBreakpoints;

          const resizeObserver = new (<any>window).ResizeObserver(entries => {
            entries.forEach(entry => {
              const elementWidth = entry.contentRect.width;

              Object.keys(breakpoints).forEach(breakpoint => {
                const minWidth = breakpoints[breakpoint];

                if (elementWidth >= minWidth) {
                  entry.target.classList.add(breakpoint);
                } else {
                  entry.target.classList.remove(breakpoint);
                }
              });
            });
          });

          this.childComponents.forEach(child => {
            resizeObserver.observe(child.componentWrapper.nativeElement);
          });
        });
      });
  }

  /**
   * Returns a WebComponent object based on its HTML content.
   * @param id An identifier for the component.
   */
  getComponent(id: string): Promise<WebComponent> {
    return new Promise((resolve, reject) => {
      const basePath = this._globals.paths.htmlComponents;
      const componentPath = id.split('/').slice(0, -1).join('/');
      const path = `${basePath}/${id}.html`;

      this._utilsService.getRplConfig().then(config => {
        // Determine if component has variants
        const hasVariants = !!config.components.find((componentSection: any) => {
          const found = componentSection.list
            .find((listItem: any) => listItem.uri === id);

          return found && found.variants && found.variants.length;
        });

        // Build component
        this.getComponentHtml(path).then(html => {
          const commentData = this._utilsService.getCommentData(html);
          const depends = commentData['depends'] ?
            commentData['depends'].split(',').map(x => x.trim()) :
            null;
          const defaultDims = commentData['defaultDims'] ?
            commentData['defaultDims'].split(',').map(x => x.trim()) :
            null;

          this.embedDependencies(
            html,
            depends,
            `${basePath}/${componentPath}`
          ).then(htmlWithDependencies => {
            resolve({
              id,
              name: commentData['name'],
              summary: commentData['summary'],
              depends,
              defaultDims,
              background: commentData['background'],
              options: commentData['options'],
              html: this.stripComponentComments(html),
              demoHtml: htmlWithDependencies,
              variantsUri: (hasVariants) ?
                '/component-variants/' + encodeURIComponent(id) :
                ''
            });
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
   * Returns styles to use for the component.
   * @param component The component with styles to set.
   */
  getComponentStyles(component: WebComponent) {
    const styles = [];

    if (component.defaultDims && component.defaultDims.length) {
      // Set width
      styles.push(`width: ${component.defaultDims[0]}`);

      if (component.defaultDims.length === 2) {
        // Set height
        styles.push(`height: ${component.defaultDims[1]}`);
      }
    }

    if (component.background) {
      styles.push(`background: ${component.background}`);
    }

    return styles.join(';');
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
