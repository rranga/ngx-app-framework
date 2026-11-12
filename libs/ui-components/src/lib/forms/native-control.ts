import {
  afterRenderEffect,
  computed,
  inject,
  signal,
  type ElementRef,
  type Signal,
} from '@angular/core';
import { NGX_FIELD_CONTEXT } from './field-context';
import { mergeIdRefs, uniqueId } from './id';
import {
  readValidity,
  sameValidity,
  VALID_CONTROL,
  type ControlValidity,
} from './validity';

export type NativeFormElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export interface ControlA11yOptions {
  /** Prefix used for the generated id when neither consumer nor field supplies one. */
  readonly idPrefix: string;
  readonly id: Signal<string | undefined>;
  readonly describedBy: Signal<string | null | undefined>;
  readonly invalid: Signal<boolean>;
  readonly required: Signal<boolean>;
  readonly touched: Signal<boolean>;
}

/** Effective accessibility state of a control after merging its enclosing field. */
export interface ControlA11y {
  readonly controlId: Signal<string>;
  readonly describedBy: Signal<string | null>;
  /** Whether the control should currently be presented as invalid. */
  readonly invalid: Signal<boolean>;
  readonly required: Signal<boolean>;
}

/**
 * Resolves a control's id, description, invalid and required state by
 * combining its own inputs with an optional enclosing {@link FieldContext}.
 *
 * Invalid presentation policy (drives `aria-invalid` and error styling):
 * - an enclosing field that displays an error always marks the control
 *   invalid, because the application chose to show that message;
 * - the control's own `invalid` state is presented once it is `touched`,
 *   so pristine fields are not announced as errors. Form libraries such as
 *   Angular Signal Forms mark every field touched on submit.
 *
 * Must be called in an injection context (e.g. a field initializer).
 */
export function injectControlA11y(options: ControlA11yOptions): ControlA11y {
  const field = inject(NGX_FIELD_CONTEXT, { optional: true });
  const fallbackId = uniqueId(options.idPrefix);

  return {
    controlId: computed(() => options.id() || field?.id() || fallbackId),
    describedBy: computed(() =>
      mergeIdRefs(field?.describedBy(), options.describedBy()),
    ),
    invalid: computed(
      () =>
        (field?.invalid() ?? false) ||
        (options.invalid() && options.touched()),
    ),
    required: computed(
      () => options.required() || (field?.required() ?? false),
    ),
  };
}

/**
 * Writes a model value into a native control only when it differs from what
 * the element already holds.
 *
 * A plain `[value]` binding would overwrite in-progress user input whenever
 * the model and the element legitimately disagree (for example, a number
 * input containing "1e" reports `value === ''` with `validity.badInput`).
 */
export function syncNativeValue(
  element: Signal<ElementRef<HTMLInputElement | HTMLTextAreaElement>>,
  value: Signal<string>,
): void {
  afterRenderEffect({
    write: () => {
      const control = element().nativeElement;
      const next = value();

      if (control.value !== next) {
        control.value = next;
      }
    },
  });
}

export interface ValidityTracker {
  readonly validity: Signal<ControlValidity>;
  /** Re-reads validity immediately, for changes the dependencies cannot see. */
  readonly refresh: () => void;
}

/**
 * Mirrors a native control's constraint-validation state into a signal.
 *
 * Validity is re-read after rendering whenever any signal read by
 * `dependencies` changes (typically the value and constraint inputs), so
 * attribute updates are already applied to the DOM when it is measured.
 */
export function trackValidity(
  element: Signal<ElementRef<NativeFormElement>>,
  dependencies: () => unknown,
): ValidityTracker {
  const validity = signal<ControlValidity>(VALID_CONTROL, {
    equal: sameValidity,
  });

  const refresh = (): void => {
    validity.set(readValidity(element().nativeElement.validity));
  };

  afterRenderEffect({
    read: () => {
      dependencies();
      refresh();
    },
  });

  return { validity: validity.asReadonly(), refresh };
}
