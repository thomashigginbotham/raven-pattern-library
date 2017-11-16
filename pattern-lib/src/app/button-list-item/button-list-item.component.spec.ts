import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ButtonListItemComponent } from './button-list-item.component';

describe('ButtonListItemComponent', () => {
  let component: ButtonListItemComponent;
  let fixture: ComponentFixture<ButtonListItemComponent>;
  let debugEl: DebugElement;
  let el: HTMLElement;

  // Setup
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonListItemComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Get first child element from component's host
    debugEl = fixture.debugElement.query(By.css('.button-list__item'));
    el = debugEl.nativeElement;
  });

  // Tests
  it ('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should assign classes to anchor tag', () => {
    component.cssClasses = 'foo bar';

    fixture.detectChanges();

    const classList = el.querySelector('a').classList;

    expect(Array.from(classList)).toEqual(['foo', 'bar']);
  });
});
