import { Component, ViewChild, ElementRef, OnInit }
  from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: [
    '../../assets/rpl-reset.css',
    './form-list.component.css'
  ]
})
export class FormListComponent implements OnInit {
  @ViewChild('wrapper')wrapper: ElementRef;

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() { }
}
