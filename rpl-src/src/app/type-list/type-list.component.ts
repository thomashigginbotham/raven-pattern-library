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
    '../shared/css/reset.css',
    './type-list.component.css'
  ]
})
export class TypeListComponent implements OnInit {
  @ViewChild('wrapper') wrapper: ElementRef;
  wrapperCssClass: string = 'type-list-wrapper';

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() { }
}
