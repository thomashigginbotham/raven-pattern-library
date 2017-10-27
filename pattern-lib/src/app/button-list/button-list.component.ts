import { Component, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-button-list',
  templateUrl: './button-list.component.html',
  styleUrls: [
    '../../assets/rpl-reset.css',
    '../../assets/ext/css/main.css',
    './button-list.component.css'
  ]
})
export class ButtonListComponent implements OnInit {
  @ViewChild('wrapper')wrapper: ElementRef;

  constructor(
    private _utilsService: UtilsService,
    private _renderer: Renderer2
  ) { }

  ngOnInit() {
    // Apply user's body styles to component
    this._utilsService.applyStyleSheetStylesToElement(
      '/assets/ext/css/main.css',
      'body',
      this.wrapper.nativeElement,
      this._renderer
    ).then();
  }

  /**
   * Alerts a random phrase.
   * @param e A click event.
   */
  onButtonClick(e) {
    e.preventDefault();

    const phraseList = [
      'Ouch!',
      'Don’t do that again.',
      'Please stop.',
      'Hey! Watch it, Mr. Clicky.',
      'What did you do that for?',
      '’Tis but a flesh wound. Come on, you pansy. Press me again!',
      'Do you always press every button you see?',
      'Nope. Nothing happened.',
      'I’m sorry, Dave. I’m afraid I can’t do that.',
      'I won’t dignify that behavior with a response.',
      'Stop pressing this button. It turns on Mrs. Schultz’s porchlight in Germany.'
    ];
    const randomSelection = Math.floor(Math.random() * phraseList.length);

    alert(phraseList[randomSelection]);
  }
}
