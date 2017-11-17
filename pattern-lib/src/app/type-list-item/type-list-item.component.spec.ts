import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { TypeListItemComponent } from './type-list-item.component';

import { UtilsService } from '../utils.service';

describe('TypeListItemComponent', () => {
  let component: TypeListItemComponent;
  let fixture: ComponentFixture<TypeListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeListItemComponent ],
      providers: [
        UtilsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeListItemComponent);
    component = fixture.componentInstance;
    component.heading = 'H1';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get font metadata', () => {
    const bodyEl = document.getElementsByTagName('body')[0];
    const paragraphEl = document.createElement('p');

    bodyEl.appendChild(paragraphEl);

    const metadata = component.getFontMetadata(paragraphEl);

    expect(metadata).toContain('#000000 400 16px/normal');
  });
});
