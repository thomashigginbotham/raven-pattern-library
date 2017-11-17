import {
  Component,
  Output,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: [
    '../../assets/rpl-reset.css',
    './type-list.component.css'
  ]
})
export class TypeListComponent implements OnInit {
  @ViewChild('wrapper') wrapper: ElementRef;
  wrapperCssClass: string = 'type-list-wrapper';
  stylesLoaded: boolean = false;

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    // Apply user's styles to component wrapper
    const styleUri = 'assets/ext/css/main.css';
    const scopedClass = 'rpl-' + this._utilsService.getGuid();

    this._utilsService.applyScopedStyles(styleUri, scopedClass)
      .then(() => {
        this.stylesLoaded = true;
      });

    this.wrapperCssClass += ' ' + scopedClass;
  }
}
