import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  numberAttribute,
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
import { optionalNumberAttribute } from '../forms/transforms';

/** Which dimensions the user may resize the textarea in. */
export type TextareaResize = 'vertical' | 'horizontal' | 'both' | 'none';

/**
 * Multi-line text input backed by a native `<textarea>`.
 *
 * Shares the Input contract: string `value` model, native constraint
 * validation via `validity`, `touched`/`touch`, automatic `ngx-field`
 * integration and Signal Forms compatibility.
 */
@Component({
  selector: 'ngx-textarea',
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormsBridge],
  host: {
    '[attr.id]': 'null',
  },
})
export class Textarea {
  /** Id of the native textarea. Defaults to the enclosing field's id, then a generated id. */
  readonly id = input<string>();
  readonly name = input('');
  readonly placeholder = input('');
  /** Visible text lines. */
  readonly rows = input(3, { transform: (value: unknown) => numberAttribute(value, 3) });
  readonly resize = input<TextareaResize>('vertical');
  readonly autocomplete = input<string | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  /** Validation state, presented once the control is `touched`. */
  readonly invalid = input(false, { transform: booleanAttribute });

  readonly describedBy = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);

  readonly minLength = input<number | undefined, unknown>(undefined, {
    transform: optionalNumberAttribute,
  });
  readonly maxLength = input<number | undefined, unknown>(undefined, {
    transform: optionalNumberAttribute,
  });

  readonly value = model('');
  readonly touched = model(false);
  readonly touch = output<void>();

  private readonly control =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('control');

  private readonly forms = inject<FormsBridge<string>>(FormsBridge);
  /** Own inputs merged with an attached Reactive/template-driven form control. */
  protected readonly state = this.forms.merge({
    disabled: this.disabled,
    invalid: this.invalid,
    required: this.required,
    touched: this.touched,
  });

  protected readonly a11y = injectControlA11y({
    idPrefix: 'ngx-textarea',
    id: this.id,
    describedBy: this.describedBy,
    invalid: this.state.invalid,
    required: this.state.required,
    touched: this.state.touched,
  });

  private readonly validityTracker = trackValidity(this.control, () => [
    this.value(),
    this.a11y.required(),
    this.state.disabled(),
    this.minLength(),
    this.maxLength(),
  ]);

  /** Native constraint-validation state of the textarea. */
  readonly validity = this.validityTracker.validity;

  constructor() {
    syncNativeValue(this.control, this.value);
    this.forms.connect({
      write: (value) => this.value.set(value == null ? '' : String(value)),
    });
  }

  focus(options?: FocusOptions): void {
    this.control().nativeElement.focus(options);
  }

  protected onInput(): void {
    this.value.set(this.control().nativeElement.value);
    this.forms.notifyChange(this.value());
  }

  protected onBlur(): void {
    this.touched.set(true);
    this.touch.emit();
    this.forms.notifyTouched();
  }
}
