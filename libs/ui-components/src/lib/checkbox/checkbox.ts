import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  viewChild,
  type ElementRef,
} from '@angular/core';
import { FormsBridge } from '../forms/forms-bridge';
import { uniqueId } from '../forms/id';
import { trackValidity } from '../forms/native-control';

/**
 * Boolean choice backed by a native `<input type="checkbox">`.
 *
 * The projected content is the checkbox's visible label. State is a boolean
 * `checked` model (never a string value), with an optional `indeterminate`
 * model that the browser clears when the user toggles the checkbox.
 *
 * A checkbox labels itself, so it is used on its own rather than inside
 * `ngx-field`. Reference hint/error text with `describedBy`.
 * Structurally compatible with Angular Signal Forms' checkbox contract.
 */
@Component({
  selector: 'ngx-checkbox',
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormsBridge],
  host: {
    '[attr.id]': 'null',
  },
})
export class Checkbox {
  /** Id of the native checkbox. Defaults to a generated id. */
  readonly id = input<string>();
  readonly name = input('');

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  /** Validation state, presented once the checkbox is `touched`. */
  readonly invalid = input(false, { transform: booleanAttribute });

  readonly describedBy = input<string | null>(null);
  /** Accessible name when no label content is projected. */
  readonly ariaLabel = input<string | null>(null);

  readonly checked = model(false);
  /** Mixed state, e.g. for a "select all" checkbox. Cleared on user toggle. */
  readonly indeterminate = model(false);
  readonly touched = model(false);
  readonly touch = output<void>();

  private readonly control =
    viewChild.required<ElementRef<HTMLInputElement>>('control');

  private readonly forms = inject<FormsBridge<boolean>>(FormsBridge);
  /** Own inputs merged with an attached Reactive/template-driven form control. */
  protected readonly state = this.forms.merge({
    disabled: this.disabled,
    invalid: this.invalid,
    required: this.required,
    touched: this.touched,
  });

  private readonly fallbackId = uniqueId('ngx-checkbox');
  protected readonly controlId = computed(() => this.id() || this.fallbackId);
  protected readonly presentedInvalid = computed(
    () => this.state.invalid() && this.state.touched(),
  );

  /** Native constraint-validation state (e.g. `valueMissing` when required). */
  readonly validity = trackValidity(this.control, () => [
    this.checked(),
    this.state.required(),
    this.state.disabled(),
  ]).validity;

  constructor() {
    this.forms.connect({
      write: (value) => this.checked.set(Boolean(value)),
      // A required checkbox must be checked; Angular's RequiredValidator
      // would accept `false` for template-driven `ngModel required`.
      requireTrue: this.required,
    });
  }

  focus(options?: FocusOptions): void {
    this.control().nativeElement.focus(options);
  }

  protected onChange(): void {
    const element = this.control().nativeElement;
    this.checked.set(element.checked);
    this.indeterminate.set(element.indeterminate);
    this.forms.notifyChange(element.checked);
  }

  protected onBlur(): void {
    this.touched.set(true);
    this.touch.emit();
    this.forms.notifyTouched();
  }
}
