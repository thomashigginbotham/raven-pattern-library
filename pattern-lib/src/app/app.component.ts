import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  navIsExpanded: boolean = false;

  ngOnInit() {

  }

  /**
   * Expands or collapses the navigation.
   * @param expand Whether to expand (true) or collapse (false) the navigation.
   */
  expandNav(expand: boolean) {
    this.navIsExpanded = expand;
  }
}
