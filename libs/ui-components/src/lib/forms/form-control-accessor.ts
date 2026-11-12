import {
  DestroyRef,
  Directive,
  effect,
  inject,
  Injector,
  untracked,
} from '@angular/core';
import {
  FormResetEvent,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
  type AbstractControl,
  type ControlValueAccessor,
  type ValidationErrors,
  type Validator,
} from '@angular/forms';
import { FormsBridge } from './forms-bridge';

interface Unsubscribable {
  unsubscribe(): void;
}

/** Parent form directive (`FormGroupDirective` / `NgForm`) as seen from a control directive. */
interface SubmittableForm {
  readonly submitted: boolean;
  readonly ngSubmit: { subscribe(next: () => void): Unsubscribable };
}

function parentForm(ngControl: NgControl): SubmittableForm | null {
  const candidate = (ngControl as { formDirective?: unknown }).formDirective;

  return candidate &&
    typeof candidate === 'object' &&
    'submitted' in candidate &&
    'ngSubmit' in candidate
    ? (candidate as SubmittableForm)
    : null;
}

/**
 * Connects library form controls to Angular Reactive Forms
 * (`formControl`, `formControlName`) and template-driven forms (`ngModel`).
 *
 * Import it next to the controls you use:
 *
 * ```ts
 * imports: [ReactiveFormsModule, Field, Input, FormControlAccessor]
 * ```
 *
 * The selector only matches when one of those form directives is present,
 * so the accessor never competes with Angular Signal Forms' `[formField]`,
 * which binds to the controls directly.
 *
 * Beyond the value, it mirrors the form control's state into the component:
 * `disable()`/`enable()`, `invalid` and `touched` (including
 * `markAllAsTouched()` and form submission) drive `aria-invalid`, and a
 * `Validators.required`/`requiredTrue` validator sets `required`.
 */
@Directive({
  // Element-qualified selectors keep the accessor scoped to library controls
  // and to classic forms directives (never `[formField]`).
  selector:
    'ngx-input[formControlName],ngx-input[formControl],ngx-input[ngModel],' +
    'ngx-textarea[formControlName],ngx-textarea[formControl],ngx-textarea[ngModel],' +
    'ngx-select[formControlName],ngx-select[formControl],ngx-select[ngModel],' +
    'ngx-checkbox[formControlName],ngx-checkbox[formControl],ngx-checkbox[ngModel],' +
    'ngx-radio-group[formControlName],ngx-radio-group[formControl],ngx-radio-group[ngModel]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: FormControlAccessor, multi: true },
    { provide: NG_VALIDATORS, useExisting: FormControlAccessor, multi: true },
  ],
})
export class FormControlAccessor implements ControlValueAccessor, Validator {
  private readonly bridge = inject(FormsBridge, { self: true });
  private readonly injector = inject(Injector);
  private subscriptions: Unsubscribable[] = [];
  private validatorChange: () => void = () => undefined;
  private destroyed = false;

  constructor() {
    // Re-run validation when the component's own validation rules change.
    effect(() => {
      this.bridge.requireTrue();
      // Revalidation reads form-control internals; don't track them here.
      untracked(() => this.validatorChange());
    });

    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.unsubscribe();
      this.bridge.external.set(null);
    });
  }

  writeValue(value: unknown): void {
    this.bridge.write(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.bridge.registerOnChange(fn);
    // Called whenever the forms API (re)binds a control, so the current
    // `FormControl` is available here; observe its state from now on.
    this.observeControl();
  }

  registerOnTouched(fn: () => void): void {
    this.bridge.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.bridge.disabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.bridge.requireTrue() ? Validators.requiredTrue(control) : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChange = fn;
  }

  private observeControl(): void {
    this.unsubscribe();

    // Resolved lazily: injecting NgControl in the constructor would be
    // circular, because NgControl itself injects NG_VALUE_ACCESSOR.
    const ngControl = this.injector.get(NgControl, null, { self: true });
    const control = ngControl?.control;

    if (this.destroyed || !ngControl || !control) {
      return;
    }

    const form = parentForm(ngControl);
    // Submission is tracked from events rather than read from
    // `form.submitted`: `resetForm()` resets controls (emitting their events)
    // before it clears `submitted`, so reading it then would be stale.
    let submitted = form?.submitted ?? false;

    const sync = (): void =>
      this.bridge.external.set({
        invalid: control.invalid,
        interacted: control.touched || submitted,
        required:
          control.hasValidator(Validators.required) ||
          control.hasValidator(Validators.requiredTrue),
      });

    this.subscriptions = [
      control.events.subscribe((event) => {
        if (event instanceof FormResetEvent) {
          submitted = false;
        }
        sync();
      }),
    ];
    if (form) {
      this.subscriptions.push(
        form.ngSubmit.subscribe(() => {
          submitted = true;
          sync();
        }),
      );
    }
    sync();
  }

  private unsubscribe(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }
}
