import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  constructor() { }

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
    const path = 'assets/rpl-config.json';

    return new Promise((resolve, reject) => {
      fetch(path).then(response => resolve(response.json()));
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
