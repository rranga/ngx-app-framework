import { Directive, inject } from '@angular/core';
import { NGX_FIELD_CONTEXT } from '../forms/field-context';

/**
 * Connects a native control projected into `ngx-field` to the field's
 * accessibility state: `aria-describedby`, `aria-invalid` and `required`.
 *
 * Library controls such as `ngx-input` integrate automatically and do not
 * need this directive.
 *
 * The bindings read signals, so they update with OnPush/zoneless change
 * detection without manual `markForCheck` calls.
 */
@Directive({
  selector: '[ngxFieldControl]',
  host: {
    '[attr.aria-describedby]': 'field.describedBy()',
    '[attr.aria-invalid]': "field.invalid() ? 'true' : null",
    '[attr.required]': "field.required() ? '' : null",
  },
})
export class FieldControl {
  protected readonly field = inject(NGX_FIELD_CONTEXT);
}
