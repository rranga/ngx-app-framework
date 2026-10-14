import {
  Directive,
  HostBinding,
  inject,
} from '@angular/core';
import { Field } from './field';

@Directive({
  selector: '[ngxFieldControl]',
  standalone: true,
})
export class FieldControl {
  private readonly field = inject(Field, { skipSelf: true });

  @HostBinding('attr.aria-describedby')
  get describedBy(): string | null {
    return this.field.describedBy();
  }

  @HostBinding('attr.aria-invalid')
  get ariaInvalid(): string | null {
    return this.field.error() ? 'true' : null;
  }

  @HostBinding('required')
  get required(): boolean {
    return this.field.required();
  }
}
