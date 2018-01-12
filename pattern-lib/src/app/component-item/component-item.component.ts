import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-item',
  templateUrl: './component-item.component.html',
  styleUrls: [
    './component-item.component.css',
  ]
})
export class ComponentItemComponent implements OnInit {
  @Input() html: string;

  constructor() { }

  ngOnInit() {
  }
}
