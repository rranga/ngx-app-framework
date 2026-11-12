import { InjectionToken, type Signal } from '@angular/core';

/** State a radio group shares with its `ngx-radio` options. */
export interface RadioGroupContext {
  readonly name: Signal<string>;
  readonly value: Signal<string | null>;
  readonly disabled: Signal<boolean>;
  readonly required: Signal<boolean>;
  select(value: string): void;
  markTouched(): void;
}

export const NGX_RADIO_GROUP = new InjectionToken<RadioGroupContext>(
  'NGX_RADIO_GROUP',
);
