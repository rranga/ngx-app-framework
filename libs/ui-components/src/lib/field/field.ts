import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { NGX_FIELD_CONTEXT, type FieldContext } from '../forms/field-context';
import { mergeIdRefs } from '../forms/id';

/**
 * Labels a single form control and associates hint and error text with it.
 *
 * Library controls (`ngx-input`, `ngx-textarea`, `ngx-select`) pick up the
 * field's id, description, error and required state automatically through
 * {@link NGX_FIELD_CONTEXT}. Native controls opt in with `ngxFieldControl`.
 */
@Component({
  selector: 'ngx-field',
  templateUrl: './field.html',
  styleUrl: './field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NGX_FIELD_CONTEXT, useExisting: Field }],
  host: {
    // `id` names the projected control. Remove it from the host element so
    // the document never contains two elements with the same id, which would
    // break `<label for>` association.
    '[attr.id]': 'null',
  },
})
export class Field implements FieldContext {
  /** Id of the projected control; the label's `for` targets it. */
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false, { transform: booleanAttribute });

  readonly hintId = computed(() => `${this.id()}-hint`);
  readonly errorId = computed(() => `${this.id()}-error`);

  readonly invalid = computed(() => !!this.error());

  readonly describedBy = computed(() =>
    mergeIdRefs(
      this.hint() ? this.hintId() : null,
      this.error() ? this.errorId() : null,
    ),
  );
}
