import { Component, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-button-list',
  templateUrl: './button-list.component.html',
  styleUrls: [
    '../../assets/rpl-reset.css',
    './button-list.component.css'
  ]
})
export class ButtonListComponent implements OnInit {
  @ViewChild('wrapper') wrapper: ElementRef;
  wrapperCssClass: string = 'button-list';

  constructor(
    private _utilsService: UtilsService,
    private _renderer: Renderer2
  ) { }

  ngOnInit() {
    // Apply user's styles to component wrapper
    this.applyScopedStyles();
  }

  /**
   * Applies the user's styles to the buttons but not the rest of the page.
   */
  applyScopedStyles() {
    const styleUri = 'assets/ext/css/main.css';

    fetch(styleUri)
      .then(response => response.text())
      .then(styles => {
        // Create temporary style tag
        const headEl = document.getElementsByTagName('head')[0];
        const styleEl = document.createElement('style');

        styleEl.appendChild(document.createTextNode(styles));
        headEl.appendChild(styleEl);

        // Prefix the selectors
        const sheet = styleEl.sheet as CSSStyleSheet;
        const prefixClass = 'rpl-' + this._utilsService.getGuid();
        const prefixSelector = '.' + prefixClass;
        const prefixedStyles = this._utilsService.prefixCssRules(
          sheet.rules,
          prefixSelector
        );

        // Replace CSS rules
        styleEl.innerText = prefixedStyles;

        // Add class to wrapper
        this.wrapperCssClass += ' ' + prefixClass;
      });
  }
}
