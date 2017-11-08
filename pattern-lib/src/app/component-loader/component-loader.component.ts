import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { rplConfig } from '../app.config';

@Component({
  selector: 'app-component-loader',
  templateUrl: './component-loader.component.html',
  styleUrls: ['./component-loader.component.css']
})
export class ComponentLoaderComponent implements OnInit {
  heading: string;
  description: string;
  list: string[];

  constructor(
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // Bind page details based on URI ID
    this._activatedRoute.params.subscribe(params => {
      const uriKey = params['id'];

      this.bindPageDetails(uriKey);
    });
  }

  /**
   * Assigns values found in rplConfig to the page.
   * @param uriKey The uriKey of the component config to load.
   */
  bindPageDetails(uriKey: string) {
    const configValues = rplConfig.components
      .find(value => value.uriKey === uriKey.toLowerCase());

    if (configValues) {
      this.heading = configValues.heading;
      this.description = configValues.description;
      this.list = configValues.list;
    }
  }
}
