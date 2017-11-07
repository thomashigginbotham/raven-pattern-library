import { Injectable, Renderer2 } from '@angular/core';

@Injectable()
export class UtilsService {
  constructor() { }

  /**
   * Applies styles from a style sheet to another element.
   * @param styleSheetPath The path to a style sheet to use.
   * @param selector A CSS selector found in the style sheet.
   * @param element The element that will receive the styles.
   * @param renderer The renderer for the element.
   */
  applyStyleSheetStylesToElement(
    styleSheetPath: string,
    selector: string,
    element: Element,
    renderer: Renderer2
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getStylesFromStyleSheet(styleSheetPath, selector)
        .then(rules => {
          if (rules && rules.length) {
            rules.forEach(rule => {
              if (rule.style && rule.style.length > 0) {
                Array.from(rule.style).forEach(prop => {
                  renderer.setStyle(
                    element,
                    prop,
                    rule.style[prop]
                  );
                });
              }
            });

            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(e => {
          reject(e);
        });
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
   * Returns styles that match a selector found in a style sheet.
   * @param styleSheetPath The path to the style sheet file.
   * @param selector A CSS selector (e.g. "li.active a") (optional).
   */
  getStylesFromStyleSheet(styleSheetPath: string, selector: string = null)
    : Promise<CSSStyleRule[]> {
    return new Promise((resolve, reject) => {
      const head = document.getElementsByTagName('head')[0];
      const link = document.createElement('link');

      link.rel = 'stylesheet';
      link.href = styleSheetPath;

      link.onload = (e) => {
        const styleSheets = document.styleSheets;
        const lastStyleSheet = styleSheets[styleSheets.length - 1] as CSSStyleSheet;
        const rules = lastStyleSheet.rules || lastStyleSheet.cssRules;

        const matches = selector === null
          ? Array.from(rules).map(rule => rule as CSSStyleRule)
          : Array.from(rules).filter(rule => {
              return (rule as CSSStyleRule).selectorText === selector;
            }) as CSSStyleRule[];

        link.remove();

        resolve(matches);
      };

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
