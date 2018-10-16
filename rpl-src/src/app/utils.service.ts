import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from './globals';

@Injectable()
export class UtilsService {
  private _rplConfig: any;

  constructor(
    private _globals: Globals
  ) { }

  /**
   * Adds a selector prefix to a CSSRuleList.
   * @param styles The styles to prefix.
   * @param prefix A CSS selector to prefix every style rule.
   */
  prefixCssRules(styles: CSSRuleList, prefix: string): string {
    return Array.from(styles).reduce((output, rule) => {
      const styleRule = rule as CSSStyleRule;
      const prefixedSelectorText = (selectorText: string) => {
        return selectorText.split(',')
          .reduce((prev, selector) => {
            const trimmedPrev = prev.trim();
            const trimmedSelector = selector
              .trim()
              .replace(/^html$|^body$/, '');

            if (!trimmedPrev) {
              return `${prefix} ${trimmedSelector}`.trim();
            }

            return `${trimmedPrev}, ${prefix} ${trimmedSelector}`.trim();
          } , '');
      };

      if (styleRule.selectorText) {
        const newSelectorText = prefixedSelectorText(styleRule.selectorText);

        return output + styleRule.cssText.replace(
          styleRule.selectorText,
          newSelectorText
        );
      }

      // Rule is a media rule
      const mediaRule = rule as CSSMediaRule;

      if (mediaRule.media && mediaRule.media.length > 0) {
        let cssText = mediaRule.cssText;

        Array.from(mediaRule.cssRules).forEach(rule => {
          const styleRule = rule as CSSStyleRule;
          const newSelectorText = prefixedSelectorText(styleRule.selectorText);
          const newRuleText = styleRule.cssText.replace(
            styleRule.selectorText,
            newSelectorText
          );

          cssText = cssText.replace(styleRule.cssText, newRuleText);
        });
        return output + cssText;
      }

      return output;
    }, '');
  }

  /**
   * Applies a <style> tag to the head containing revised rules that scope the
   * CSS to a provided class name.
   * @param styleUri The URI of the style sheet to apply.
   * @param className The HTML class name to act as a scope.
   */
  applyScopedStyles(styleUri: string, className: string): Promise<boolean> {
    return fetch(styleUri)
      .then(response => response.text())
      .then(styles => {
        // Create temporary style tag
        const headEl = document.getElementsByTagName('head')[0];
        const styleEl = document.createElement('style');

        styleEl.appendChild(document.createTextNode(styles));
        headEl.appendChild(styleEl);

        // Prefix the selectors
        const sheet = styleEl.sheet as CSSStyleSheet;
        const prefixSelector = '.' + className;
        const prefixedStyles = this.prefixCssRules(
          sheet.cssRules,
          prefixSelector
        );

        // Replace CSS rules
        styleEl.innerText = prefixedStyles;

        return true;
      });
  }

  /**
   * Converts an RGB value to a hexadecimal value.
   * @param rgbString The string to convert.
   */
  convertRgbToHex(rgbString: string): string {
    if (rgbString.indexOf('rgb(') !== 0) {
      throw new Error('Not a valid RGB string.');
    }

    const rgb = rgbString.split(',');
    const redHex = ('0' + parseInt(rgb[0].substring(4)).toString(16)).slice(-2);
    const greenHex = ('0' + parseInt(rgb[1]).toString(16)).slice(-2);
    const blueHex = ('0' + parseInt(rgb[2]).toString(16)).slice(-2);
    const hexString = `#${redHex}${greenHex}${blueHex}`;

    return hexString;
  }

  /**
   * Returns key/value pair information from HTML comments.
   * @param html The HTML to search for comment data.
   */
  getCommentData(html: string): object {
    const commentMatches = html.match(/^\s*<!--\s*\r?\nName:[\s\S]+-->/);

    if (!commentMatches || commentMatches.length === 0) {
      return null;
    }

    const commentKeys = [
      { key: 'name', value: 'Name' },
      { key: 'summary', value: 'Summary' },
      { key: 'depends', value: 'Depends' },
      { key: 'background', value: 'Background' }
    ];
    const regexStopWords = commentKeys.map(commentKey => {
      return `(${commentKey.value}:)`;
    });
    const commentData = {};

    commentKeys.forEach(commentKey => {
      const regexString = `${commentKey.value}:[\\s\\S]+?(?=${regexStopWords.join('|')}|(-->))`;
      const regex = new RegExp(regexString);
      const definition = commentMatches[0].match(regex);

      if (definition) {
        const keyValue = definition[0].split(':');
        const value = keyValue[1].trim().replace(/\s{2,}/g, ' ');

        commentData[commentKey.key] = value;
      } else {
        commentData[commentKey.key] = null;
      }
    });

    return commentData;
  }

  /**
   * Returns a GUID.
   */
  getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8);

      return v.toString(16);
    });
  }

  /**
   * Returns configuration values from a JSON file.
   */
  getRplConfig(): Promise<any> {
    if (this._rplConfig) {
      return Promise.resolve(this._rplConfig);
    }

    return new Promise((resolve, reject) => {
      fetch(this._globals.paths.config)
        .then(response => {
          this._rplConfig = response.json();

          return this._rplConfig;
        })
        .then(config => resolve(config));
    });
  }

  /**
   * Returns styles that match a selector found in a style sheet.
   * @param styleSheetPath The path to the style sheet file.
   * @param selector A CSS selector (e.g. "li.active a") (optional).
   */
  getStylesFromStyleSheet(styleSheetPath: string, selector: string = null)
    : Promise<CSSRule[]> {
    return new Promise((resolve, reject) => {
      const head = document.getElementsByTagName('head')[0];
      const link = document.createElement('link');

      link.rel = 'stylesheet';
      link.href = '';

      link.onload = (e) => {
        const styleSheet = link.sheet as CSSStyleSheet;
        const rules = styleSheet.rules || styleSheet.cssRules;

        const matches = selector === null
          ? Array.from(rules)
          : Array.from(rules).filter(rule => {
              return (rule as CSSStyleRule).selectorText === selector;
            });

        link.remove();

        resolve(matches);
      };

      link.href = styleSheetPath;

      try {
        head.appendChild(link);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * Returns the last segment of the current URL path.
   * @param router The current router.
   */
  getUriLastSegment(router: Router) {
    const uriPathNoFragment = this.getUriPath(router);
    const uriSegment = uriPathNoFragment.split('/').pop();

    return uriSegment;
  }

  /**
   * Returns the current URL path.
   * @param router The current router;
   */
  getUriPath(router: Router) {
    const uriPathNoFragment = router.url.split('#').shift();

    return uriPathNoFragment;
  }

  /**
   * Returns a full path from a path relative to a base path.
   * @param basePath The base path (not including a trailing slash).
   * @param relativePath The path to resolve.
   */
  resolveRelativePath(basePath: string, relativePath: string): string {
    const resolvedParts = basePath.split('/');
    const relativeParts = relativePath.split('/');

    for (let n = 0; n < relativeParts.length; n++) {
      if (relativeParts[n] === '..') {
        resolvedParts.pop();
      } else if (relativeParts[n] !== '.') {
        resolvedParts.push(relativeParts[n]);
      }
    }

    return resolvedParts.join('/');
  }

  /**
   * Rounds a number that has a unit of measurement attached.
   * @param valueWithUnit A value with a unit (e.g. "10.5px");
   */
  roundNumberWithUnit(valueWithUnit: string): string {
    const value = parseFloat(valueWithUnit.replace(/[^\d\.]/g, ''));
    const unit = valueWithUnit.replace(/[\d\.]/g, '');

    if (Number.isNaN(value)) {
      // Does not begin with a number
      return valueWithUnit;
    }

    return Math.round(value) + unit;
  }
}
