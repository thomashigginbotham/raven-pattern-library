import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-custom-page',
  templateUrl: './custom-page.component.html',
  styleUrls: ['./custom-page.component.css']
})
export class CustomPageComponent implements OnInit {
  groupName: string;
  heading: string;
  description: string;
  htmlContent: string;

  constructor(
    private _utilsService: UtilsService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // Bind content
    this._activatedRoute.paramMap.subscribe(params => {
      const parentId = params.get('parentId');
      const pageId = params.get('id');
      let pageName = pageId + '.html';

      if (parentId) {
        pageName = parentId + '-' + pageName;
      }

      fetch(`assets/custom-pages/${pageName}`).then(response => {
        response.text().then(text => {
          // Bind HTML
          this.htmlContent = text;

          // Bind comment data
          const commentData = this._utilsService.getCommentData(text);
          const headingParts = commentData['name'].split('/');

          if (headingParts.length > 1) {
            this.groupName = headingParts[0];
            this.heading = headingParts[1];
          } else {
            this.heading = commentData['name'];
          }

          this.description = commentData['summary'];
        })
      });
    });
  }
}
