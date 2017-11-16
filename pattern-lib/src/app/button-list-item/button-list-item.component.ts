import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-list-item',
  templateUrl: './button-list-item.component.html',
  styleUrls: ['./button-list-item.component.css']
})
export class ButtonListItemComponent implements OnInit {
  private _cssClasses: string[] = [];

  cssSelector: string;

  get cssClasses(): string {
    return this._cssClasses.join(' ');
  }

  @Input('cssClasses')
  set cssClasses(value: string) {
    this._cssClasses = value.split(' ');

    if (this._cssClasses.length > 0) {
      this.cssSelector = '.' + this._cssClasses.join('.');
    }
  }

  constructor() { }

  ngOnInit() {
  }

  /**
   * Alerts a random phrase.
   * @param e A click event.
   */
  onButtonClick(e) {
    e.preventDefault();

    const phraseList = [
      '’Tis but a flesh wound. Come on, you pansy. Press me again!',
      'I’m sorry, Dave. I’m afraid I can’t do that.',
      'Stop pressing this button. It turns on Mrs. Schultz’s porchlight in Germany.',
      'Thank you for pressing the self-destruct button. This page will self destruct in three minutes.',
      'Now calculating the answer to the ultimate question of life, the universe, and everything. 7.5 million years remaining. Please wait...',
      'Make no further attempt to leave this page. A party associate will arrive shortly to collect you for your party. The cake is great!',
      'I used to press buttons. Then I took an arrow to the knee.',
      'Generating cover sheet for TPS report. I’m gonna need you to come in tomorrow to pick it up. So if you could be here around 9, that would be great.'
    ];
    const randomSelection = Math.floor(Math.random() * phraseList.length);

    alert(phraseList[randomSelection]);
  }
}
