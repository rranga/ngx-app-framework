import { computed, Injectable, signal, type Signal } from '@angular/core';

/** State reported by an attached form-control model (e.g. a Reactive Forms `FormControl`). */
export interface ExternalFormState {
  readonly invalid: boolean;
  /** The control is touched, or its form has been submitted. */
  readonly interacted: boolean;
  /** The control has a `required`/`requiredTrue` validator. */
  readonly required: boolean;
}

export interface FormsBridgeHandlers {
  /** Applies a model value written by the forms API. Must not report a change back. */
  readonly write: (value: unknown) => void;
  /** When `true`, the control must be `true` to be valid (checkbox `required`). */
  readonly requireTrue?: Signal<boolean>;
}

/** A component's own inputs, merged with any attached form-control model. */
export interface MergedFormState {
  readonly disabled: Signal<boolean>;
  readonly invalid: Signal<boolean>;
  readonly required: Signal<boolean>;
  readonly touched: Signal<boolean>;
}

const noop = (): void => undefined;
const NEVER = signal(false).asReadonly();

/**
 * Connects a form control component to the optional `FormControlAccessor`
 * directive without the component importing `@angular/forms`.
 *
 * Each control provides its own instance. The component supplies how to
 * write values and reports user changes and blurs; the accessor supplies the
 * form-control state.
 *
 * @internal Not part of the public API.
 */
@Injectable()
export class FormsBridge<T = unknown> {
  private handlers: FormsBridgeHandlers | null = null;
  private changeFn: (value: T) => void = noop;
  private touchedFn: () => void = noop;

  /** Disabled state set through the forms API (`FormControl.disable()`). */
  readonly disabled = signal(false);
  /** State of the attached form control, or `null` when none is attached. */
  readonly external = signal<ExternalFormState | null>(null);

  readonly requireTrue = computed(() => (this.handlers?.requireTrue ?? NEVER)());

  /** Called once by the owning component. */
  connect(handlers: FormsBridgeHandlers): void {
    this.handlers = handlers;
  }

  /**
   * Merges the component's own inputs with the attached form control.
   * When a form control is attached it owns `touched`, so `reset()` and
   * `markAllAsTouched()` are reflected; otherwise the component's own
   * `touched` model is used.
   */
  merge(own: {
    readonly disabled: Signal<boolean>;
    readonly invalid: Signal<boolean>;
    readonly required: Signal<boolean>;
    readonly touched: Signal<boolean>;
  }): MergedFormState {
    return {
      disabled: computed(() => own.disabled() || this.disabled()),
      invalid: computed(
        () => own.invalid() || (this.external()?.invalid ?? false),
      ),
      required: computed(
        () => own.required() || (this.external()?.required ?? false),
      ),
      touched: computed(() => {
        const external = this.external();
        return external ? external.interacted : own.touched();
      }),
    };
  }

  // Accessor-facing API.

  write(value: unknown): void {
    this.handlers?.write(value);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touchedFn = fn;
  }

  // Component-facing API.

  /** Reports a value change made by the user. */
  notifyChange(value: T): void {
    this.changeFn(value);
  }

  /** Reports that the user left the control. */
  notifyTouched(): void {
    this.touchedFn();
  }
}
