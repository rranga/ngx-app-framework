import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  viewChild,
  type ElementRef,
} from '@angular/core';
import {
  injectControlA11y,
  syncNativeValue,
  trackValidity,
} from '../forms/native-control';
import { FormsBridge } from '../forms/forms-bridge';
import {
  optionalNumberAttribute,
  optionalStringAttribute,
  patternAttribute,
} from '../forms/transforms';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';

/** Virtual-keyboard hint, mirroring the HTML `inputmode` attribute. */
export type InputMode =
  | 'none'
  | 'text'
  | 'decimal'
  | 'numeric'
  | 'tel'
  | 'search'
  | 'email'
  | 'url';

/**
 * Single-line text input backed by a native `<input>`.
 *
 * - The value is always a `string`, including for `type="number"`, because
 *   that is what the browser reports. Parse it where you consume it.
 * - Validation uses native constraint validation. `validity` exposes the
 *   current state as error keys; the application decides when and how to
 *   display messages (for example after `touched` or on submit).
 * - Inside `ngx-field`, the id, description, invalid and required state are
 *   inherited from the field automatically.
 * - Structurally compatible with Angular Signal Forms (`[formField]`).
 */
@Component({
  selector: 'ngx-input',
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormsBridge],
  host: {
    // `id` is forwarded to the native element; keep it off the host so ids
    // stay unique and `<label for>` resolves to the input.
    '[attr.id]': 'null',
  },
})
export class Input {
  /** Id of the native input. Defaults to the enclosing field's id, then a generated id. */
  readonly id = input<string>();
  readonly name = input('');
  readonly type = input<InputType>('text');
  readonly placeholder = input('');
  readonly autocomplete = input<string | null>(null);
  readonly inputMode = input<InputMode | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  /**
   * Validation state. Presented (`aria-invalid`, error styling) once the
   * control is `touched`; set `touched` too to present it immediately.
   */
  readonly invalid = input(false, { transform: booleanAttribute });

  /** Additional ids to reference from `aria-describedby`. */
  readonly describedBy = input<string | null>(null);
  /** Accessible name when the input has no visible `<label>`. */
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);

  // Native constraint attributes.
  readonly minLength = input<number | undefined, unknown>(undefined, {
    transform: optionalNumberAttribute,
  });
  readonly maxLength = input<number | undefined, unknown>(undefined, {
    transform: optionalNumberAttribute,
  });
  readonly min = input<string | undefined, unknown>(undefined, {
    transform: optionalStringAttribute,
  });
  readonly max = input<string | undefined, unknown>(undefined, {
    transform: optionalStringAttribute,
  });
  /** Granularity for `type="number"`; use `'any'` to allow any decimal. */
  readonly step = input<string | undefined, unknown>(undefined, {
    transform: optionalStringAttribute,
  });
  /** HTML pattern (implicitly anchored, matched against the whole value). */
  readonly pattern = input<string | undefined, unknown>(undefined, {
    transform: patternAttribute,
  });

  readonly value = model('');
  /** Becomes `true` once the input loses focus. */
  readonly touched = model(false);
  /** Emits each time the input loses focus. */
  readonly touch = output<void>();

  private readonly control =
    viewChild.required<ElementRef<HTMLInputElement>>('control');

  private readonly forms = inject<FormsBridge<string>>(FormsBridge);
  /** Own inputs merged with an attached Reactive/template-driven form control. */
  protected readonly state = this.forms.merge({
    disabled: this.disabled,
    invalid: this.invalid,
    required: this.required,
    touched: this.touched,
  });

  protected readonly a11y = injectControlA11y({
    idPrefix: 'ngx-input',
    id: this.id,
    describedBy: this.describedBy,
    invalid: this.state.invalid,
    required: this.state.required,
    touched: this.state.touched,
  });

  private readonly validityTracker = trackValidity(this.control, () => [
    this.value(),
    this.type(),
    this.a11y.required(),
    this.state.disabled(),
    this.minLength(),
    this.maxLength(),
    this.min(),
    this.max(),
    this.step(),
    this.pattern(),
  ]);

  /** Native constraint-validation state of the input. */
  readonly validity = this.validityTracker.validity;

  constructor() {
    syncNativeValue(this.control, this.value);
    this.forms.connect({
      write: (value) => this.value.set(value == null ? '' : String(value)),
    });
  }

  /** Moves focus to the native input. */
  focus(options?: FocusOptions): void {
    this.control().nativeElement.focus(options);
  }

  protected onInput(): void {
    this.value.set(this.control().nativeElement.value);
    // `badInput` can change without the string value changing (e.g. "" -> "e"
    // in a number input), so read validity directly as well.
    this.validityTracker.refresh();
    this.forms.notifyChange(this.value());
  }

  protected onBlur(): void {
    this.touched.set(true);
    this.touch.emit();
    this.forms.notifyTouched();
  }
}
