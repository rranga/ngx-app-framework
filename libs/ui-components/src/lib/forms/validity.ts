/**
 * Native constraint-validation failures, in the order they are reported by
 * {@link ControlValidity.errors}. The first entry is the most actionable one
 * to show a user (for example, "required" before "too short").
 */
export const VALIDITY_ERROR_KEYS = [
  'badInput',
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'tooShort',
  'tooLong',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
  'customError',
] as const;

export type ValidityErrorKey = (typeof VALIDITY_ERROR_KEYS)[number];

/**
 * An immutable snapshot of a native control's `ValidityState`.
 *
 * The library deliberately reports error *keys* rather than messages so
 * applications own wording and localisation.
 */
export interface ControlValidity {
  readonly valid: boolean;
  readonly errors: readonly ValidityErrorKey[];
}

export const VALID_CONTROL: ControlValidity = Object.freeze({
  valid: true,
  errors: Object.freeze([]) as readonly ValidityErrorKey[],
});

/** Creates a snapshot from a live `ValidityState`. */
export function readValidity(state: ValidityState): ControlValidity {
  const errors = VALIDITY_ERROR_KEYS.filter((key) => state[key]);

  return errors.length ? { valid: false, errors } : VALID_CONTROL;
}

/** Structural equality, used to avoid notifying consumers of no-op changes. */
export function sameValidity(a: ControlValidity, b: ControlValidity): boolean {
  return (
    a.valid === b.valid &&
    a.errors.length === b.errors.length &&
    a.errors.every((error, index) => error === b.errors[index])
  );
}
