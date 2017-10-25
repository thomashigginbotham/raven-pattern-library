import { Component, ViewChild, AfterContentInit, Renderer2, ElementRef }
  from '@angular/core';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: [
    '../../assets/rpl-reset.css',
    '../../assets/ext/css/main.css',
    './type-list.component.css'
  ]
})
export class TypeListComponent implements AfterContentInit {
  @ViewChild('wrapper')wrapper: ElementRef;
  @ViewChild('h1')h1: ElementRef;
  @ViewChild('h2')h2: ElementRef;
  @ViewChild('h3')h3: ElementRef;
  @ViewChild('h4')h4: ElementRef;
  @ViewChild('h5')h5: ElementRef;
  @ViewChild('h6')h6: ElementRef;
  @ViewChild('p')p: ElementRef;
  @ViewChild('blockquote')blockquote: ElementRef;
  @ViewChild('ul')ul: ElementRef;
  @ViewChild('ol')ol: ElementRef;
  @ViewChild('dl')dl: ElementRef;
  headerMetadata: string[] = [];
  paragraphMetadata: string;
  blockquoteMetadata: string;
  ulMetadata: string;
  olMetadata: string;
  dlMetadata: string;

  constructor(
    private _utilsService: UtilsService,
    private _renderer: Renderer2
  ) { }

  ngAfterContentInit() {
    const headerEls = [
      this.h1.nativeElement,
      this.h2.nativeElement,
      this.h3.nativeElement,
      this.h4.nativeElement,
      this.h5.nativeElement,
      this.h6.nativeElement
    ];

    this._utilsService.applyStyleSheetStylesToElement(
      '/assets/ext/css/main.css',
      'body',
      this.wrapper.nativeElement,
      this._renderer
    ).then(() => {
      this.headerMetadata = this.bindMetadata(headerEls);
      this.paragraphMetadata = this.bindMetadata([this.p.nativeElement])[0];
      this.blockquoteMetadata = this.bindMetadata(
        [this.blockquote.nativeElement]
      )[0];
      this.ulMetadata = this.bindMetadata([this.ul.nativeElement])[0];
      this.olMetadata = this.bindMetadata([this.ol.nativeElement])[0];
      this.dlMetadata = this.bindMetadata([this.dl.nativeElement])[0];
    });
  }

  /**
   * Extracts type-related CSS properties from an array of elements and returns
   * a string of related metadata for each one.
   * @param elements An array of elements.
   */
  bindMetadata(elements: any[]): string[] {
    return elements.map(element => {
      const style = window.getComputedStyle(element);
      const rgbColor = style.getPropertyValue('color');
      const fontWeight = style.getPropertyValue('font-weight');
      const fontSize = style.getPropertyValue('font-size');
      const lineHeight = style.getPropertyValue('line-height');
      const fontFamily = style.getPropertyValue('font-family');

      const hexColor = this._utilsService.convertRgbToHex(rgbColor);
      const roundedFontSize = this._utilsService.roundNumberWithUnit(fontSize);
      const roundedLineHeight = this._utilsService.roundNumberWithUnit(lineHeight);

      return `${hexColor} ${fontWeight} ${roundedFontSize}/${roundedLineHeight}
        ${fontFamily}`;
    });
  }
}
