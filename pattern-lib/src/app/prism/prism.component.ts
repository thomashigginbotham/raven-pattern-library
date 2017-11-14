import {
  Component,
  AfterViewInit,
  Input,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import * as Prism from 'prismjs';

@Component({
  selector: 'app-prism',
  templateUrl: './prism.component.html',
  styleUrls: ['./prism.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrismComponent implements AfterViewInit {
  @Input() language: string;
  @ViewChild('rawContent') rawContent: ElementRef;
  content: string;

  constructor(
    private _elementRef: ElementRef
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.content = Prism.highlight(
        this.rawContent.nativeElement.innerText.trim(),
        Prism.languages[this.language]
      );
    }, 0);
  }
}
