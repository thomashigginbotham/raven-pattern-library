import {
  Component,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ComponentService } from '../component.service';

@Component({
  selector: 'app-component-item',
  templateUrl: './component-item.component.html',
  styleUrls: ['./component-item.component.css']
})
export class ComponentItemComponent implements AfterViewInit {
  @Input() componentId: string;
  @Input() html: string;

  @ViewChild('componentWrapper', { static: false })
  componentWrapper: ElementRef;

  constructor(
    private _componentService: ComponentService
  ) { }

  ngAfterViewInit() {
    this.addAttrListener();
    this.attachScripts();
  }

  /**
   * Adds communication with service for attribute changes.
   */
  addAttrListener() {
    const el = this.componentWrapper.nativeElement as HTMLElement;
    const componentEl = Array.from(el.children)
      .find(x => !x.hasAttribute('hidden'));

    // Send initial class attributes
    this._componentService.sendMessage({
      id: this.componentId,
      content: { type: 'info', attr: 'class', value: componentEl.classList }
    });

    // Send other initial attributes
    if (componentEl.hasAttributes()) {
      Array.from(componentEl.attributes).forEach((attr) => {
        if (attr.name === 'class') {
          return;
        }

        this._componentService.sendMessage({
          id: this.componentId,
          content: { type: 'info', attr: attr.name, value: attr.value }
        });
      });
    }

    // Listen for change requests
    this._componentService.messages.subscribe(message => {
      if (message.id !== this.componentId || message.content.type !== 'update') {
        return;
      }

      if (message.content.attr === 'class') {
        if (message.content.selected) {
          componentEl.classList.add(message.content.value);
        } else {
          componentEl.classList.remove(message.content.value);
        }
      } else {
        if (message.content.selected) {
          componentEl.setAttribute(message.content.attr, message.content.value);
        } else {
          componentEl.removeAttribute(message.content.attr);
        }
      }
    });
  }

  /**
   * Finds script tags in the component's HTML and runs them by attaching them
   * to the body element.
   */
  attachScripts() {
    const el = this.componentWrapper.nativeElement;
    const scripts = el.querySelectorAll('script');

    if (scripts) {
      const bodyEl = document.querySelector('body');

      scripts.forEach((script: HTMLScriptElement) => {
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
