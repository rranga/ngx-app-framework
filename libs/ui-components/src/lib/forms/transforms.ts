/**
 * Input transforms for optional native constraint attributes. They accept
 * both static template attributes (`minLength="3"`) and bound values
 * (`[minLength]="3"`), and map "not set" to `undefined` so the attribute is
 * omitted rather than rendered empty.
 */

export function optionalNumberAttribute(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Transform for the native `pattern` attribute.
 *
 * Strings are passed through. Angular Signal Forms binds `pattern` as a
 * `RegExp[]` and validates those expressions itself, so non-string values are
 * ignored instead of being rendered as an invalid attribute.
 */
export function patternAttribute(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined;
}

export function optionalStringAttribute(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  return String(value);
}
