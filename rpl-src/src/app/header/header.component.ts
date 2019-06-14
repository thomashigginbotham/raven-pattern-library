import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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
    this._utilsService.getRplConfig().then(config => {
      this.title = config.title;
      this.logoUri = config.logoUri;
    });
  }

  /**
   * Emits an event to tell the navigation to expand.
   */
  emitExpandNav() {
    this.onExpandNav.emit(true);
  }
}
