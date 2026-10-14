import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'ngx-field',
  standalone: true,
  templateUrl: './field.html',
  styleUrl: './field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Field {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false);

  readonly describedBy = computed(() => {
    const ids: string[] = [];

    if (this.hint()) {
      ids.push(`${this.id()}-hint`);
    }

    if (this.error()) {
      ids.push(`${this.id()}-error`);
    }

    return ids.length ? ids.join(' ') : null;
  });
}
