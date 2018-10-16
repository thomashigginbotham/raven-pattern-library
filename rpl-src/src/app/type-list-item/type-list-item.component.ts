import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-type-list-item',
  templateUrl: './type-list-item.component.html',
  styleUrls: [
    './type-list-item.component.css'
  ]
})
export class TypeListItemComponent implements AfterViewChecked {
  @Input() heading: string;
  @ViewChild('wrapper') wrapper: ElementRef;
  metadata: string;

  constructor(
    private _utilsService: UtilsService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewChecked() {
    this.updateFontMetadata();
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Updates the string of font data.
   */
  updateFontMetadata() {
    const wrapperEl: Element = this.wrapper.nativeElement;
    const transcludedEl = wrapperEl.lastElementChild;

    this.metadata = this.getFontMetadata(transcludedEl);
  }

  /**
   * Returns a string of font data for a given element.
   * @param el The element to check.
   */
  getFontMetadata(el: Element) {
    const style = window.getComputedStyle(el);
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
  }
}
