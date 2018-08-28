import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private _navIsExpanded: boolean;
  private _activeClassName: string = 'active';

  @Output()
  onExpandNav = new EventEmitter<boolean>();

  @Input('expanded') set navIsExpanded(value: boolean) {
    this._navIsExpanded = value;
    this.updateCssClasses();
  }
  get navIsExpanded(): boolean {
    return this._navIsExpanded;
  }

  navCssClasses: string[] = ['app-nav'];
  navData: {}[];
  componentData: {}[];

  constructor(
    private _router: Router,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    // Get navigation
    this._utilsService.getRplConfig().then(config => {
      this.navData = config.navigation;
      this.componentData = config.components;
    });

    // Expand navigation by default on large viewports
    setTimeout(() => this.expandNavByWinSize(), 0);
  }

  /**
   * Returns a list of components belonging to a navigation item.
   * @param navItem The navigation item to use.
   */
  getComponentList(navItem: { uri: string }): { title: string, uri: string }[] {
    const uriParts = navItem.uri.split('/');
    const uriKey = uriParts[uriParts.length - 1];

    const componentItem = this.componentData
      .find((item: { uriKey: string }) => {
        return item.uriKey === uriKey;
      });

    return componentItem['list'];
  }

  /**
   * Adds an "active" class if the navigation is expanded. If not, the class
   * is removed.
   */
  updateCssClasses() {
    const expandedIndex = this.navCssClasses.indexOf(this._activeClassName);

    if (this._navIsExpanded && expandedIndex === -1) {
      this.navCssClasses.push(this._activeClassName);
    } else if (!this._navIsExpanded && expandedIndex > -1) {
      this.navCssClasses.splice(expandedIndex, 1);
    }
  }

  /**
   * Updates CSS classes and emits an event according to the navigation's
   * expansion status.
   */
  updateCssAndEmit() {
    this.updateCssClasses();
    this.onExpandNav.emit(this._navIsExpanded);
  }

  /**
   * Toggles the navigation expansion and emits an event.
   */
  toggleNav() {
    this._navIsExpanded = !this._navIsExpanded;
    this.updateCssAndEmit();
  }

  /**
   * Expands or collapse the navigation depending on the window size.
   */
  expandNavByWinSize() {
    const viewportIsLarge = this.isViewportLarge();

    if (viewportIsLarge && !this._navIsExpanded) {
      this._navIsExpanded = true;
      this.updateCssAndEmit();
    } else if (!viewportIsLarge && this._navIsExpanded) {
      this._navIsExpanded = false;
      this.updateCssAndEmit();
    }
  }

  /**
   * Collapses the navigation if the viewport is small.
   */
  closeNavIfSmallViewport() {
    if (!this.isViewportLarge()) {
      this._navIsExpanded = false;
      this.updateCssAndEmit();
    }
  }

  /**
   * Returns whether a navigation item links to a component.
   * @param navItem The navigation item.
   */
  isComponentLink(navItem: { uri: string }): boolean {
    return navItem.uri.startsWith('components/');
  }

  /**
   * Returns whether a URI is the active route.
   * @param uri The URI to test.
   */
  isActive(uri: string): boolean {
    return this._router.isActive(uri, false);
  }

  /**
   * Returns true if the viewport size is large enough to show the navigation
   * without overlaying content.
   */
  isViewportLarge() {
    return window.matchMedia('(min-width: 1024px)').matches;
  }
}
