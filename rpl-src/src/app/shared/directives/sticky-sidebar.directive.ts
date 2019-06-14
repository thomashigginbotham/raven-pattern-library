import { Directive, OnInit, ElementRef } from '@angular/core';

declare var StickySidebar: any;

@Directive({
  selector: '[appStickySidebar]'
})
export class StickySidebarDirective implements OnInit {
  el: HTMLElement;

  constructor(
    private _elementRef: ElementRef
  ) {
    this.el = _elementRef.nativeElement;
  }

  ngOnInit() {
    new StickySidebar(
      this.el,
      {
        minWidth: 1024,
        topSpacing: 32,
        bottomSpacing: 32,
        containerSelector: 'main',
        innerWrapperSelector: '.app-nav__inner'
      }
    );
  }
}
