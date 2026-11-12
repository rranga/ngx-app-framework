import type {
  ControlValidity,
  ValidityErrorKey,
} from '@rranga/ngx-ui-components';

/** Shared layout styles for story showcase components. */
export const SHOWCASE_STYLES = `
  :host {
    display: grid;
    gap: var(--ngx-space-8);
    max-width: 28rem;
    font-family: var(--ngx-font-family-base);
    color: var(--ngx-color-text);
  }

  section {
    display: grid;
    gap: var(--ngx-space-2);
  }

  form {
    display: grid;
    gap: var(--ngx-space-6);
  }

  h3 {
    margin: 0;
    font-size: var(--ngx-font-size-md);
  }

  p {
    margin: 0;
    font-size: var(--ngx-font-size-sm);
    color: var(--ngx-color-text-muted);
  }

  button {
    justify-self: start;
    padding: var(--ngx-space-2) var(--ngx-space-4);
    font: inherit;
    color: var(--ngx-color-text);
    background: var(--ngx-color-surface-raised);
    border: var(--ngx-border-width) solid var(--ngx-color-border);
    border-radius: var(--ngx-radius-md);
    cursor: pointer;
  }

  button:focus-visible {
    outline: 2px solid var(--ngx-color-focus-ring);
    outline-offset: 2px;
  }
`;

/**
 * Example application-owned message catalogue. The library reports
 * validity keys only; wording and localisation belong to the application.
 */
export function validationMessage(
  validity: ControlValidity,
  messages: Partial<Record<ValidityErrorKey, string>>,
): string {
  const key = validity.errors.find((error) => messages[error]);
  return key ? (messages[key] ?? '') : '';
}
