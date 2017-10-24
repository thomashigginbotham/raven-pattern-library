import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output()
  onExpandNav = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Emits an event to tell the navigation to expand.
   */
  emitExpandNav() {
      this.onExpandNav.emit(true);
  }
}
