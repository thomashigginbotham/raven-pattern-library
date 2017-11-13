import { Component, ViewChild, ElementRef, Renderer2, OnInit }
  from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: [
    '../../assets/rpl-reset.css',
    '../../assets/ext/css/main.css',
    './table-list.component.css'
  ]
})
export class TableListComponent implements OnInit {
  @ViewChild('wrapper')wrapper: ElementRef;

  constructor(
    private _utilsService: UtilsService,
    private _renderer: Renderer2
  ) { }

  ngOnInit() {
    // Apply user's body styles to component
    this._utilsService.applyStyleSheetStylesToElement(
      'assets/ext/css/main.css',
      'body',
      this.wrapper.nativeElement,
      this._renderer
    )
  }
}
