import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormsBridge } from '../forms/forms-bridge';
import { mergeIdRefs, uniqueId } from '../forms/id';
import {
  NGX_RADIO_GROUP,
  type RadioGroupContext,
} from './radio-group-context';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

/**
 * Groups `ngx-radio` options under a visible legend.
 *
 * Renders a native `<fieldset role="radiogroup">` and gives every option the
 * same `name`, so browsers provide single selection, arrow-key navigation
 * and a single tab stop natively. The group owns its own label, hint and
 * error (a group is labelled by a legend, not a `<label for>`), so it is not
 * placed inside `ngx-field`.
 */
@Component({
  selector: 'ngx-radio-group',
  templateUrl: './radio-group.html',
  styleUrl: './radio-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormsBridge,
    {
      provide: NGX_RADIO_GROUP,
      useFactory: (): RadioGroupContext => inject(RadioGroup).context,
    },
  ],
  host: {
    '[attr.id]': 'null',
  },
})
export class RadioGroup {
  /** Base id for the group's legend, hint and error. Defaults to a generated id. */
  readonly id = input<string>();
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly error = input('');
  /** Shared `name` for the native radios. Defaults to the group id. */
  readonly name = input('');
  readonly orientation = input<RadioGroupOrientation>('vertical');

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  /**
   * Validation state, presented once the group is `touched`. A non-empty
   * `error` is always presented.
   */
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly describedBy = input<string | null>(null);

  /** Value of the selected option, or `null` when none is selected. */
  readonly value = model<string | null>(null);
  readonly touched = model(false);
  readonly touch = output<void>();

  private readonly forms = inject<FormsBridge<string | null>>(FormsBridge);
  /** Own inputs merged with an attached Reactive/template-driven form control. */
  protected readonly state = this.forms.merge({
    disabled: this.disabled,
    invalid: this.invalid,
    required: this.required,
    touched: this.touched,
  });

  private readonly fallbackId = uniqueId('ngx-radio-group');

  protected readonly groupId = computed(() => this.id() || this.fallbackId);
  protected readonly legendId = computed(() => `${this.groupId()}-label`);
  protected readonly hintId = computed(() => `${this.groupId()}-hint`);
  protected readonly errorId = computed(() => `${this.groupId()}-error`);

  protected readonly isInvalid = computed(
    () => !!this.error() || (this.state.invalid() && this.state.touched()),
  );
  protected readonly ariaDescribedBy = computed(() =>
    mergeIdRefs(
      this.hint() ? this.hintId() : null,
      this.error() ? this.errorId() : null,
      this.describedBy(),
    ),
  );

  /**
   * State shared with child `ngx-radio` options through `NGX_RADIO_GROUP`.
   * @internal Not part of the public API.
   */
  readonly context: RadioGroupContext = {
    name: computed(() => this.name() || this.groupId()),
    value: this.value,
    disabled: this.state.disabled,
    required: this.state.required,
    select: (value) => {
      this.value.set(value);
      this.forms.notifyChange(value);
    },
    markTouched: () => {
      this.touched.set(true);
      this.touch.emit();
      this.forms.notifyTouched();
    },
  };

  constructor() {
    this.forms.connect({
      write: (value) => this.value.set(value == null ? null : String(value)),
    });
  }
}
