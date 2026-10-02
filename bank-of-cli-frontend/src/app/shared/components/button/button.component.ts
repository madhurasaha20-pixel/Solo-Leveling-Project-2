import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button [type]="type">{{label}}</button>`
})
export class ButtonComponent {
  @Input() label = 'Button';
  @Input() type: 'button' | 'submit' = 'button';
}
