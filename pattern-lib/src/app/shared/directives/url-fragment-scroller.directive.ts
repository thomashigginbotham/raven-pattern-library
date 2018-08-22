import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[urlFragmentId]',
  inputs: ['urlFragmentId']
})
export class UrlFragmentScrollerDirective implements OnInit, OnDestroy {
  public urlFragmentId: string;

  private scrollBehavior: string;
  private fragmentSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef
  ) {
    this.urlFragmentId = null;
    this.fragmentSubscription = null;

    // "Auto" works best for scrolling when a page first loads
    this.scrollBehavior = 'auto';
  }

  ngOnInit() {
    // Scroll to element when URL fragment changes
    this.fragmentSubscription = this.activatedRoute.fragment
      .subscribe((fragment: string) => {
        setTimeout(() => {
          if (fragment && fragment === this.urlFragmentId) {
            this.scrollToElement();
          }

          // Use smooth scrolling from now on
          if (this.scrollBehavior !== 'smooth') {
            this.scrollBehavior = 'smooth';
          }
        });
      });
  }

  ngOnDestroy() {
    if (this.fragmentSubscription) {
      this.fragmentSubscription.unsubscribe();
    }
  }

  /**
   * Scrolls the element into view.
   */
  scrollToElement() {
    this.elementRef.nativeElement.scrollIntoView({
      behavior: this.scrollBehavior,
      block: 'start'
    });
  }
}
