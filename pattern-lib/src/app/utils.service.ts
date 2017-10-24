import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

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
   * Returns styles that match a selector found in a style sheet.
   * @param styleSheetPath The path to the style sheet file.
   * @param selector A CSS selector (e.g. "li.active a").
   */
  getStylesFromStyleSheet(styleSheetPath: string, selector: string)
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

        const matches = Array.from(rules).filter(rule => {
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
