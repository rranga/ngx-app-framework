import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  viewChild,
  type ElementRef,
} from '@angular/core';
import { uniqueId } from '../forms/id';
import { NGX_RADIO_GROUP } from './radio-group-context';

/**
 * A single option inside `ngx-radio-group`. The projected content is the
 * option's visible label. Values must be unique within a group.
 */
@Component({
  selector: 'ngx-radio',
  templateUrl: './radio.html',
  styleUrl: './radio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'null',
  },
})
export class Radio {
  protected readonly group = inject(NGX_RADIO_GROUP);

  /** Id of the native radio. Defaults to a generated id. */
  readonly id = input<string>();
  readonly value = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly control =
    viewChild.required<ElementRef<HTMLInputElement>>('control');

  private readonly fallbackId = uniqueId('ngx-radio');
  protected readonly controlId = computed(() => this.id() || this.fallbackId);
  protected readonly checked = computed(
    () => this.group.value() === this.value(),
  );
  protected readonly isDisabled = computed(
    () => this.disabled() || this.group.disabled(),
  );

  focus(options?: FocusOptions): void {
    this.control().nativeElement.focus(options);
  }

  protected onChange(): void {
    if (this.control().nativeElement.checked) {
      this.group.select(this.value());
    }
  }
}
