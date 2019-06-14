import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: [
    '../shared/css/reset.css',
    './type-list.component.css'
  ]
})
export class TypeListComponent implements OnInit {
  @ViewChild('wrapper', { static: false }) wrapper: ElementRef;
  wrapperCssClass: string = 'type-list-wrapper';

  constructor() { }

  ngOnInit() {
  }
}
