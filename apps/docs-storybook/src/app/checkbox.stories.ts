import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Checkbox } from '@rranga/ngx-ui-components';
import { SHOWCASE_STYLES } from './story-helpers';

@Component({
  selector: 'ngx-docs-checkbox-showcase',
  imports: [Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    SHOWCASE_STYLES,
    `
      .error {
        color: var(--ngx-color-error);
      }
      .nested {
        display: grid;
        gap: var(--ngx-space-2);
        padding-left: var(--ngx-space-6);
      }
    `,
  ],
  template: `
    <section>
      <h3>Required</h3>
      <ngx-checkbox
        [required]="true"
        [invalid]="!!termsError()"
        describedBy="checkbox-terms-error"
        [(checked)]="terms"
        [(touched)]="termsTouched"
      >
        I agree to the terms of service
      </ngx-checkbox>
      @if (termsError(); as error) {
        <p id="checkbox-terms-error" class="error" role="alert">{{ error }}</p>
      }
    </section>

    <section>
      <h3>Indeterminate ("select all")</h3>
      <ngx-checkbox
        [checked]="allSelected()"
        [indeterminate]="someSelected()"
        (checkedChange)="selectAll($event)"
      >
        All notifications
      </ngx-checkbox>
      <div class="nested">
        <ngx-checkbox [(checked)]="email">Email</ngx-checkbox>
        <ngx-checkbox [(checked)]="sms">SMS</ngx-checkbox>
        <ngx-checkbox [(checked)]="push">Push</ngx-checkbox>
      </div>
    </section>

    <section>
      <h3>Disabled</h3>
      <ngx-checkbox [disabled]="true">Unavailable option</ngx-checkbox>
      <ngx-checkbox [disabled]="true" [checked]="true">Locked on</ngx-checkbox>
    </section>
  `,
})
class CheckboxShowcase {
  readonly terms = signal(false);
  readonly termsTouched = signal(false);
  readonly termsError = computed(() =>
    this.termsTouched() && !this.terms() ? 'You must accept the terms to continue.' : '',
  );

  readonly email = signal(true);
  readonly sms = signal(false);
  readonly push = signal(false);

  private readonly channels = computed(() => [this.email(), this.sms(), this.push()]);
  readonly allSelected = computed(() => this.channels().every(Boolean));
  readonly someSelected = computed(
    () => this.channels().some(Boolean) && !this.allSelected(),
  );

  selectAll(checked: boolean): void {
    this.email.set(checked);
    this.sms.set(checked);
    this.push.set(checked);
  }
}

const meta: Meta = {
  title: 'Design System/Forms/Checkbox',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Examples: Story = {
  render: () => ({
    moduleMetadata: { imports: [CheckboxShowcase] },
    template: '<ngx-docs-checkbox-showcase />',
  }),
};
