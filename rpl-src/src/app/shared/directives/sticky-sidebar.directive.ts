import { Directive, ElementRef, OnInit } from '@angular/core';

declare var StickySidebar: any;

@Directive({
  selector: '[appStickySidebar]'
})
export class StickySidebarDirective implements OnInit {
  el: HTMLElement;

  constructor(
    private elementRef: ElementRef
  ) {
    this.el = elementRef.nativeElement;
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
