import { InjectionToken, type Signal } from '@angular/core';

/**
 * Contract between a field wrapper (such as `ngx-field`) and the form control
 * projected into it.
 *
 * A wrapper provides this token so the control can, without any manual wiring:
 * - default its element `id` to the one the wrapper's `<label for>` targets,
 * - reference the wrapper's hint/error elements through `aria-describedby`,
 * - reflect the wrapper's error state as `aria-invalid`, and
 * - reflect the wrapper's required state.
 *
 * Custom controls can inject this token to participate in the same contract.
 */
export interface FieldContext {
  /** The id of the labelled control element. */
  readonly id: Signal<string>;
  /** Space-separated ids of the wrapper's description elements, or `null`. */
  readonly describedBy: Signal<string | null>;
  /** Whether the wrapper currently displays an error. */
  readonly invalid: Signal<boolean>;
  /** Whether the wrapper marks the control as required. */
  readonly required: Signal<boolean>;
}

export const NGX_FIELD_CONTEXT = new InjectionToken<FieldContext>(
  'NGX_FIELD_CONTEXT',
);
