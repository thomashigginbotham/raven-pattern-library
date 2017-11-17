import { Component, ViewChild, ElementRef, OnInit }
  from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: [
    '../../assets/rpl-reset.css',
    './table-list.component.css'
  ]
})
export class TableListComponent implements OnInit {
  @ViewChild('wrapper')wrapper: ElementRef;
  wrapperCssClass: string = 'table-list';

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    // Apply user's styles to component wrapper
    const styleUri = 'assets/ext/css/main.css';
    const scopedClass = 'rpl-' + this._utilsService.getGuid();

    this._utilsService.applyScopedStyles(styleUri, scopedClass);

    this.wrapperCssClass += ' ' + scopedClass;
  }
}
