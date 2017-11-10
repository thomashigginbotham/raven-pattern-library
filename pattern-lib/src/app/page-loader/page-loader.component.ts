import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {
  heading: string;
  description: string;
  pageUri: SafeResourceUrl;
  iframeIsMaximized: boolean;
  maximizeText: string;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _domSanitizer: DomSanitizer,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.setMaximizeText();

    this._activatedRoute.params.subscribe(params => {
      const uriKey = params['id'];

      this.bindPageDetails(uriKey);
    });
  }

  /**
   * Assigns values found in rplConfig to the page.
   * @param uriKey The uriKey of the page config to load.
   */
  bindPageDetails(uriKey: string) {
    this._utilsService.getRplConfig().then(config => {
      const configValues = config.pages
        .find(value => value.uriKey === uriKey.toLowerCase());

      if (configValues) {
        const sanitizedUri = this._domSanitizer.bypassSecurityTrustResourceUrl(
          configValues.uri
        );

        this.heading = configValues.heading;
        this.description = configValues.description;
        this.pageUri = sanitizedUri;
      }
    });
  }

  /**
   * Toggles the value of the iframeIsMaximized property.
   */
  toggleMaximize() {
    this.iframeIsMaximized = !this.iframeIsMaximized;
    this.setMaximizeText();
  }

  /**
   * Sets the text for the maximize button.
   */
  setMaximizeText() {
    if (!this.iframeIsMaximized) {
      this.maximizeText = 'Enlarge';
    } else {
      this.maximizeText = 'Collapse';
    }
  }
}
