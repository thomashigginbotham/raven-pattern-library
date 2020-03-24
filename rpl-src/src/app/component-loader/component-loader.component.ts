import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-component-loader',
  templateUrl: './component-loader.component.html',
  styleUrls: ['./component-loader.component.css']
})
export class ComponentLoaderComponent implements OnInit {
  private _list: string[];

  sectionId: string;
  groupName: string;
  heading: string;
  description: string;
  listValues: string;
  loadVariants: boolean;

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
    // Bind page details based on whether to load variants and the URI ID
    combineLatest([
      this._activatedRoute.data,
      this._activatedRoute.params
    ]).subscribe(([data, params]) => {
      this.loadVariants = data.loadVariants;
      this.sectionId = decodeURIComponent(params.id);

      this.bindPageDetails(this.sectionId, this.loadVariants);
    });
  }

  /**
   * Assigns values found in rplConfig to the page.
   * @param sectionId The ID (uriKey) of the component config to load.
   * @param loadVariants Whether to load component variations instead of a
   *        component section.
   */
  bindPageDetails(sectionId: string, loadVariants: boolean) {
    this._utilsService.getRplConfig().then(config => {
      if (!loadVariants) {
        // Set page details and list of components
        const configValues = config.components
          .find(value => value.uriKey === sectionId.toLowerCase());

        if (configValues) {
          this.groupName = 'Components';
          this.heading = configValues.heading;
          this.description = configValues.description;
          this.list = configValues.list
            .map((item: { uri: string }) => item.uri);
        }
      } else {
        // Set variant page details and components
        let componentData;
        const componentSection = config.components.find((x: any) => {
          const found = x.list
            .find((listItem: any) => listItem.uri === sectionId);

          componentData = found;

          return found && found.variants && found.variants.length;
        });

        if (componentData) {
          this.groupName = 'Component Variants';
          this.heading = componentData.title;
          this.description = 'The following variations are available for this component.';
          this.list = componentData.variants;
        }
      }
    });
  }
}
