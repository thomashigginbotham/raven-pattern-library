import { Component, Renderer2, ViewChild, ElementRef, OnInit }
  from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: [
    '../../assets/rpl-reset.css',
    '../../assets/ext/css/main.css',
    './form-list.component.css'
  ]
})
export class FormListComponent implements OnInit {
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
    )
  }

}
