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
    if (!this.list || this.list.length === 0) {
      return;
    }

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
        const commentData = this._utilsService.getCommentData(html);

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
      'assets/ext/css/main.css',
      'body',
      this.wrapper.nativeElement,
      this._renderer
    );

    // Apply user styles to component
    this._utilsService.getStylesFromStyleSheet(
      'assets/ext/css/main.css'
    ).then(cssRules => {
      const uniqueCssClass = 'rpl-' + this._utilsService.getGuid()
      const demoRenderCssClass = 'component-item__demo-render';
      const styleEl = document.createElement('style');
      let css: string = '';

      cssRules.forEach(rule => {
        const styleRule = rule as CSSStyleRule;

        if (styleRule.selectorText) {
          // Prepend the selector to the rule
          css += this.prependSelectorToCssRule(
            '.' + uniqueCssClass + ' .' + demoRenderCssClass,
            styleRule
          );
        } else {
          // Rule is a media rule
          const mediaRule = rule as CSSMediaRule;

          if (mediaRule.media && mediaRule.media.length > 0) {
            css += '@media ' + mediaRule.media.mediaText;
            css += '{';

            Array.from(mediaRule.cssRules).forEach(rule => {
              css += this.prependSelectorToCssRule(
                '.' + uniqueCssClass + ' .' + demoRenderCssClass,
                rule as CSSStyleRule
              );
            });

            css += '}';
          }
        }
      });

      styleEl.appendChild(document.createTextNode(css));

      this.wrapper.nativeElement.classList.add(uniqueCssClass);
      this.wrapper.nativeElement.appendChild(styleEl);
    });
  }

  /**
   * Adds a custom selector to the beginning of a CSSStyleRule and returns the
   * modified text for the rule.
   * @param selector The selector to prepend to the rule.
   * @param rule The style rule to use.
   */
  prependSelectorToCssRule(selector: string, rule: CSSStyleRule): string {
    const scopedSelector = selector + ' ' +
      rule.selectorText.replace(
        /,\s*([^,{]+)/g,
        ', ' + selector + ' $1'
      );

    const scopedText = rule.cssText.replace(
      rule.selectorText,
      scopedSelector
    );

    return scopedText;
  }
}
