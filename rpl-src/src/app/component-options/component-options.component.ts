import { Component, OnInit, Input } from '@angular/core';
import { ComponentService } from '../component.service';
import { WebComponentOption } from './component-options.model';

@Component({
  selector: 'app-component-options',
  templateUrl: './component-options.component.html',
  styleUrls: ['./component-options.component.css']
})
export class ComponentOptionsComponent implements OnInit {
  @Input() componentId: string;
  @Input() options: WebComponentOption[];

  constructor(
    private _componentService: ComponentService
  ) { }

  ngOnInit() {
    this.addAttrListener();
  }

  addAttrListener() {
    this._componentService.messages.subscribe(message => {
      if (message.id !== this.componentId || message.content.type !== 'info') {
        return;
      }

      this.options.forEach(option => {
        if (message.content.attr === 'class' && option.attr === 'class') {
          if (message.content.value.contains(option.value)) {
            option.selected = true;
          } else {
            option.selected = false;
          }
        } else if (message.content.attr === option.attr) {
          // Option is an attribute to toggle on
          option.selected = message.content.value === option.value ||
            message.content.attr === message.content.value ||
            message.content.value === '';
        }
      });
    });
  }

  updateOption(option: WebComponentOption, event: any) {
    option.selected = event.currentTarget.checked;

    this._componentService.sendMessage({
      id: this.componentId,
      content: {
        type: 'update',
        attr: option.attr,
        value: option.value,
        selected: option.selected
      }
    });
  }
}
