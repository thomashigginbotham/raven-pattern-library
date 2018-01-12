import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-button-list',
  templateUrl: './button-list.component.html',
  styleUrls: [
    '../../assets/rpl-reset.css',
    './button-list.component.css'
  ]
})
export class ButtonListComponent implements OnInit {
  @ViewChild('wrapper') wrapper: ElementRef;
  wrapperCssClass: string = 'button-list';

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() { }
}
