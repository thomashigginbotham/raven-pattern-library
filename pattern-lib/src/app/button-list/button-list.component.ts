import { Component, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-button-list',
  templateUrl: './button-list.component.html',
  styleUrls: [
    '../../assets/ext/css/main.css',
    '../../assets/rpl-reset.css',
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
}
