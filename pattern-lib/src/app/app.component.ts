import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  navIsExpanded: boolean = false;

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
    // Scroll to top after route change
    this._router.events.subscribe(e => {
      if (!(e instanceof NavigationEnd)) {
        return;
      }

      window.scrollTo(0, 0);
    });
  }

  /**
   * Expands or collapses the navigation.
   * @param expand Whether to expand (true) or collapse (false) the navigation.
   */
  expandNav(expand: boolean) {
    this.navIsExpanded = expand;
  }
}
