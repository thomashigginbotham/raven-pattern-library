import { Component, Input, ViewChild, ElementRef, OnInit }
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
export class ComponentListComponent implements OnInit {
  private _list: string;
  @ViewChild('wrapper') wrapper: ElementRef;
  wrapperCssClass: string = 'component-list';
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
    private _utilsService: UtilsService
  ) { }

  ngOnInit() { }

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
}
