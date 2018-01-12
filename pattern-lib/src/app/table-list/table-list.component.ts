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

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() { }
}
