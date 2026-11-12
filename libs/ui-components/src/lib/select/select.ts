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
import { FormsBridge } from '../forms/forms-bridge';
import { injectControlA11y, trackValidity } from '../forms/native-control';

export interface SelectOption {
  /** Value written to the `value` model when the option is chosen. */
  readonly value: string;
  /** Visible text of the option. */
  readonly label: string;
  readonly disabled?: boolean;
}

/**
 * Single-value select backed by a native `<select>`, which keeps platform
 * keyboard behaviour, type-ahead and mobile pickers.
 *
 * - `value` is the selected option's value, or `''` when nothing is chosen.
 * - Provide `placeholder` to render an empty first option. Without it, the
 *   browser displays the first option; initialise `value` to match it.
 * - `required` with a `placeholder` reports `valueMissing` until a real
 *   option is chosen.
 */
@Component({
  selector: 'ngx-select',
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormsBridge],
  host: {
    '[attr.id]': 'null',
  },
})
export class Select {
  /** Id of the native select. Defaults to the enclosing field's id, then a generated id. */
  readonly id = input<string>();
  readonly name = input('');
  readonly options = input<readonly SelectOption[]>([]);
  /** Text of an empty first option (value `''`). Omit to render none. */
  readonly placeholder = input('');
  readonly autocomplete = input<string | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  /** Validation state, presented once the control is `touched`. */
  readonly invalid = input(false, { transform: booleanAttribute });

  readonly describedBy = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);

  readonly value = model('');
  readonly touched = model(false);
  readonly touch = output<void>();

  private readonly control =
    viewChild.required<ElementRef<HTMLSelectElement>>('control');

  private readonly forms = inject<FormsBridge<string>>(FormsBridge);
  /** Own inputs merged with an attached Reactive/template-driven form control. */
  protected readonly state = this.forms.merge({
    disabled: this.disabled,
    invalid: this.invalid,
    required: this.required,
    touched: this.touched,
  });

  protected readonly a11y = injectControlA11y({
    idPrefix: 'ngx-select',
    id: this.id,
    describedBy: this.describedBy,
    invalid: this.state.invalid,
    required: this.state.required,
    touched: this.state.touched,
  });

  /** Native constraint-validation state of the select. */
  readonly validity = trackValidity(this.control, () => [
    this.value(),
    this.options(),
    this.placeholder(),
    this.a11y.required(),
    this.state.disabled(),
  ]).validity;

  constructor() {
    this.forms.connect({
      write: (value) => this.value.set(value == null ? '' : String(value)),
    });
  }

  focus(options?: FocusOptions): void {
    this.control().nativeElement.focus(options);
  }

  protected onChange(): void {
    this.value.set(this.control().nativeElement.value);
    this.forms.notifyChange(this.value());
  }

  protected onBlur(): void {
    this.touched.set(true);
    this.touch.emit();
    this.forms.notifyTouched();
  }
}
