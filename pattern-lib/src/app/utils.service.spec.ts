import { TestBed, inject } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  const headEl = document.getElementsByTagName('head')[0];
  const styleEl = document.createElement('style');

  headEl.appendChild(styleEl);

  const sheet = styleEl.sheet as CSSStyleSheet;

  // Setup
  beforeEach(() => {
    while (sheet.rules.length > 0) {
      sheet.deleteRule(0);
    }

    TestBed.configureTestingModule({
      providers: [UtilsService]
    });
  });

  // Tests
  // prefixCssRules()
  it ('should be created', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));

  it (
    'should prefix CSS rules',
    inject([UtilsService], (service: UtilsService) => {
      const prefix = '#foo .bar';

      sheet.insertRule('h1 { color: white; }');

      const prefixedStyles = service.prefixCssRules(
        sheet.cssRules,
        prefix
      );

      expect(prefixedStyles).toContain('#foo .bar h1');
    })
  );

  it (
    'should prefix media query rules',
    inject([UtilsService], (service: UtilsService) => {
      const prefix = '#foo .bar';

      sheet.insertRule(
        '@media (min-width: 50rem) { h1 { color: white; } }'
      );

      const prefixedStyles = service.prefixCssRules(
        sheet.cssRules,
        prefix
      );

      expect(prefixedStyles).toContain('#foo .bar h1');
    })
  );

  it (
    'should prefix comma-separated selectors',
    inject([UtilsService], (service: UtilsService) => {
      const prefix = '#foo .bar';

      sheet.insertRule('h1, h2 { color: white; }');

      const prefixedStyles = service.prefixCssRules(
        sheet.cssRules,
        prefix
      );

      expect(prefixedStyles).toContain('#foo .bar h1, #foo .bar h2');
    })
  )

  it (
    'should replace body and html rules with prefix',
    inject([UtilsService], (service: UtilsService) => {
      const prefix = '#foo .bar';

      sheet.insertRule('html, body { height: 100%; }');

      const prefixedStyles = service.prefixCssRules(
        sheet.cssRules,
        prefix
      );

      expect(prefixedStyles).toContain('#foo .bar, #foo .bar {');
    })
  )
});
