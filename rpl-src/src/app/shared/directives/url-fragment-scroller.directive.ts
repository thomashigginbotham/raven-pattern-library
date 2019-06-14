import { Directive, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Directive({
  selector: '[urlFragmentId]',
  inputs: ['urlFragmentId']
})
export class UrlFragmentScrollerDirective implements OnInit, OnDestroy {
  public urlFragmentId: string;

  private scrollBehavior: string;
  private fragmentSubscription: Subscription;
  private scrollListener: () => void;

  constructor(
    private renderer: Renderer2,
    private router: Router,
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
        if (this.scrollListener) {
          this.scrollListener();
        }

        setTimeout(() => {
          if (fragment && fragment === this.urlFragmentId) {
            this.scrollToElement();

            setTimeout(() => {
              this.removeFragmentAfterScroll();
            }, 1000);
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

    if (this.scrollListener) {
      this.scrollListener();
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

  /**
   * Removes the fragment part of the URL after the user scrolls, then stops
   * listening for scroll events.
   */
  removeFragmentAfterScroll() {
    this.scrollListener = this.renderer.listen(window, 'scroll', () => {
      this.router.navigate([], { fragment: '' });
      this.scrollListener();
    });
  }
}
