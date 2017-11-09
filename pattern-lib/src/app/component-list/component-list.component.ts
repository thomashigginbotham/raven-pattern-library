import { Component, Input, ViewChild, ElementRef, Renderer2, OnInit }
  from '@angular/core';

import { WebComponent } from './component.model';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: [
    './component-list.component.css'
  ]
})
export class ComponentListComponent implements OnInit {
  private _list: string;
  @ViewChild('wrapper') wrapper: ElementRef;
  webComponents: WebComponent[];

  get list(): string {
    return this._list;
  }

  @Input()
  set list(value: string) {
    this._list = value;
    this.bindComponents();
  }

  constructor(
    private _utilsService: UtilsService,
    private _renderer: Renderer2
  ) { }

  ngOnInit() {
    // Apply user's styles
    this.applyUserStyles();
  }

  /**
   * Clears the current web components, then gets new ones from the list
   * property.
   */
  bindComponents() {
    const componentPromises: Promise<WebComponent>[] = [];
    this.webComponents = [];

    this.list.split(',').forEach(name => {
      const trimmedName = name.trim();
      const path = `assets/ext/html/components/${trimmedName}.html`;

      componentPromises.push(this.getComponent(path));
    });

    Promise.all(componentPromises).then(webComponents => {
      this.webComponents = webComponents;
    });
  }

  /**
   * Returns a WebComponent object based on its HTML content.
   * @param path The path to the HTML file.
   */
  getComponent(path: string): Promise<WebComponent> {
    return new Promise((resolve, reject) => {
      this.getComponentHtml(path).then(html => {
        const commentData = this.getComponentCommentData(html);

        resolve({
          name: commentData['name'],
          summary: commentData['summary'],
          html: this.stripComponentComments(html)
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
   * Returns key/value pair information from a component's HTML comments.
   * @param html The HTML to search for comment data.
   */
  getComponentCommentData(html: string): object {
    const matches = html.match(/<!--\s*\r?\nName:\s*(.+)\r?\nSummary:\s*([\s\S]+?)-->/);

    if (!matches || matches.length < 3) {
      return null;
    }

    return {
      name: matches[1],
      summary: matches[2].replace(/\s{2,}/g, ' ').trim()
    };
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
   * Pulls in styles from the user style sheet to apply to the components.
   */
  applyUserStyles() {
    // Apply user's body styles to component wrapper
    this._utilsService.applyStyleSheetStylesToElement(
      '../../assets/ext/css/main.css',
      'body',
      this.wrapper.nativeElement,
      this._renderer
    );

    // Apply user styles to component
    this._utilsService.getStylesFromStyleSheet(
      '../../assets/ext/css/main.css'
    ).then(cssRules => {
      const uniqueCssClass = 'rpl-' + this._utilsService.getGuid();
      const styleEl = document.createElement('style');
      let css: string = '';

      cssRules.forEach(rule => {
        if (rule.selectorText) {
          const scopedSelector = '.' + uniqueCssClass + ' ' + rule.selectorText.replace(
            /,\s*([^,{]+)/g,
            ', .' + uniqueCssClass + ' $1'
          );

          const scopedText = rule.cssText.replace(
            rule.selectorText,
            scopedSelector
          );

          css += scopedText;
        }
      });

      styleEl.appendChild(document.createTextNode(css));

      this.wrapper.nativeElement.classList.add(uniqueCssClass);
      this.wrapper.nativeElement.appendChild(styleEl);
    });
  }
}
