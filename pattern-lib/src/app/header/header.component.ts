import { Component, Output, OnInit, EventEmitter } from '@angular/core';

import { rplConfig } from '../app.config';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() onExpandNav = new EventEmitter<boolean>();
  title: string;
  logoUri: string;

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    // Set logo and title
    this.title = rplConfig.title;
    this.logoUri = rplConfig.logoUri;
  }

  /**
   * Emits an event to tell the navigation to expand.
   */
  emitExpandNav() {
      this.onExpandNav.emit(true);
  }
}
