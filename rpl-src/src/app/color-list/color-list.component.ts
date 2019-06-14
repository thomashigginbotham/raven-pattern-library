import { Component, OnInit } from '@angular/core';

import { Globals } from '../globals';
import { Color } from './color.model';
import { ColorService } from '../color.service';

@Component({
  selector: 'app-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.css']
})
export class ColorListComponent implements OnInit {
  brandColors: Color[];
  accentColors: Color[];
  utilityColors: Color[];
  neutralColors: Color[];

  constructor(
    private _colorService: ColorService,
    private _globals: Globals
  ) { }

  ngOnInit() {
    // Bind colors
    this.getColorDetails(['brand']).then(
      colors => this.brandColors = colors
    );

    this.getColorDetails(['accent']).then(
      colors => this.accentColors = colors
    );

    this.getColorDetails(['utility']).then(
      colors => this.utilityColors = colors
    );

    this.getColorDetails(['neutral']).then(
      colors => this.neutralColors = colors
    );
  }

  /**
   * Gets Color objects based on Sass color variables.
   * @param sassVarSuffixes An array of Sass color variable suffixes.
   */
  getColorDetails(sassVarSuffixes: string[]): Promise<Color[]> {
    const scssPath = this._globals.paths.sassVars;
    const colorVarPrefix = '$color-';

    return new Promise((resolve, reject) => {
      fetch(scssPath)
        .then((response) => {
          response.text().then(scssText => {
            const colorDetails: Color[] = [];
            const promises: Promise<Color>[] = [];

            sassVarSuffixes.forEach(sassVarPrefix => {
              promises.push(...this.getColorsBySassVar(
                colorVarPrefix + sassVarPrefix,
                scssText
              ));
            });

            if (promises.length) {
              Promise.all(promises).then(colors => {
                if (colors && colors.length) {
                  colorDetails.push(...colors);

                  this.addColorVariants(colorDetails, scssText)
                    .then(colors => {
                      resolve(colors);
                    });
                }
              });
            } else {
              // No exact variable matches found. Try similar variables.
              sassVarSuffixes.forEach(sassVarPrefix => {
                promises.push(...this.getColorsBySassVar(
                  colorVarPrefix + sassVarPrefix,
                  scssText,
                  true
                ));
              });

              if (promises.length) {
                const duplicateColorVars: string[] = [];

                Promise.all(promises).then(colors => {
                  if (colors && colors.length) {
                    // Add color if it is not a variant color
                    colors.forEach(color => {
                      const sassVarParts = color.sassVar.split('-');

                      sassVarParts.pop();

                      const sassVarPrefix = sassVarParts.join('-');

                      if (duplicateColorVars.indexOf(sassVarPrefix) === -1) {
                        colorDetails.push(color);
                        duplicateColorVars.push(color.sassVar);
                      }
                    });

                    // Add its variants
                    this.addColorVariants(colorDetails, scssText)
                      .then(colors => {
                        resolve(colors);
                      });
                  }
                });
              } else {
                resolve(null);
              }
            }
          });
        });
    });
  }

  /**
   * Adds variant colors to a Color object.
   * @param colors The colors that need variants.
   * @param scssText The Sass content to search for variant colors.
   */
  addColorVariants(colors: Color[], scssText: string): Promise<Color[]> {
    return new Promise((resolve, reject) => {
      const colorCount = colors.length;
      let fulfilled = 0;
      const fulfillColor = () => {
        fulfilled++;

        if (fulfilled === colorCount) {
          resolve(colors);
        }
      };

      colors.forEach(color => {
        const variantPattern = new RegExp(`\\${color.sassVar}[^:]+:[^;]+`, 'g');
        const promises = this.getColorsByRegex(variantPattern, scssText);

        if (promises && promises.length) {
          Promise.all(promises).then(variantColors => {
            color.variants = variantColors;
            fulfillColor();
          });
        } else {
          fulfillColor();
        }
      });
    });
  }

  /**
   * Returns Color objects that match a Sass variable.
   * @param scssVar The Sass color variable to use.
   * @param scssText The Sass style sheet content to search within.
   * @param matchSimilar Whether to match similar variables or not.
   */
  getColorsBySassVar(
    scssVar: string,
    scssText: string,
    matchSimilar: boolean = false
  ) : Promise<Color>[] {
    const pattern = matchSimilar
      ? new RegExp(`\\${scssVar}[^:]+:[^;]+`, 'g')
      : new RegExp(`\\${scssVar}:[^;]+`);
    const promises = this.getColorsByRegex(pattern, scssText);

    return promises;
  }

  /**
   * Returns a Color object by applying a regular expression to a Sass style
   * sheet.
   * @param pattern A regular expression pattern to match a Sass variable.
   * @param scssText The Sass styles containing the color variable.
   */
  getColorsByRegex(pattern: RegExp, scssText: string): Promise<Color>[] {
    const matches = scssText.match(pattern);

    if (!matches) {
      return [];
    }

    const colors: Promise<Color>[] = matches.map(match => {
      const varParts = match.split(':');

      if (varParts.length !== 2) {
        return null;
      }

      return new Promise((resolve, reject) => {
        const colorName = this._colorService.getColorName(varParts[1].trim());

        const color: Color = {
          name: colorName,
          sassVar: varParts[0].trim(),
          hex: varParts[1].trim(),
          variants: null
        };

        resolve(color);
      });
    });

    return colors;
  }
}
