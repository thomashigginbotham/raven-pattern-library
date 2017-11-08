import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

import { rplConfig } from '../app.config';

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
  navData: {}[] = rplConfig.navigation;

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    // Expand navigation by default on large viewports
    setTimeout(() => this.expandNavByWinSize(), 0);
  }

  onResize(event: Event) {
    this.expandNavByWinSize();
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
  closeNavIfLargeViewport() {
    if (!this.isViewportLarge()) {
      this._navIsExpanded = false;
      this.updateCssAndEmit();
    }
  }

  /**
   * Returns true if the viewport size is large enough to show the navigation
   * without overlaying content.
   */
  isViewportLarge() {
    return window.matchMedia('(min-width: 1024px)').matches;
  }
}
