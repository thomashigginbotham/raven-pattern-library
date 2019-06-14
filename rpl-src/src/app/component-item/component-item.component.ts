import {
  Component,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-component-item',
  templateUrl: './component-item.component.html',
  styleUrls: ['./component-item.component.css']
})
export class ComponentItemComponent implements AfterViewInit {
  @Input() html: string;

  @ViewChild('componentWrapper', { static: false })
  componentWrapper: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    const el = this.componentWrapper.nativeElement;
    const scripts = el.querySelectorAll('script');

    // Evaluate any script tags found in the HTML
    if (scripts) {
      const bodyEl = document.querySelector('body');

      scripts.forEach(script => {
        const newScript = document.createElement('script');
        const src = script.getAttribute('src');

        if (src) {
          newScript.setAttribute('src', src);
        }

        newScript.innerHTML = script.innerHTML;

        bodyEl.appendChild(newScript);
      });
    }
  }
}
