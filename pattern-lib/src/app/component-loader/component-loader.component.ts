import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-component-loader',
  templateUrl: './component-loader.component.html',
  styleUrls: ['./component-loader.component.css']
})
export class ComponentLoaderComponent implements OnInit {
  private _list: string[];

  heading: string;
  description: string;
  listValues: string;

  get list(): string[] {
    return this._list;
  }

  set list(value: string[]) {
    this._list = value;
    this.listValues = value.join();
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _utilsService: UtilsService
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
    this._utilsService.getRplConfig().then(config => {
      const configValues = config.components
        .find(value => value.uriKey === uriKey.toLowerCase());

      if (configValues) {
        this.heading = configValues.heading;
        this.description = configValues.description;
        this.list = configValues.list
          .map((item: { uri: string }) => item.uri);
      }
    });
  }
}
