import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Radio, RadioGroup } from '@rranga/ngx-ui-components';
import { SHOWCASE_STYLES } from './story-helpers';

@Component({
  selector: 'ngx-docs-radio-group-showcase',
  imports: [RadioGroup, Radio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: SHOWCASE_STYLES,
  template: `
    <p>
      Keyboard: Tab moves into the group (one tab stop), arrow keys move between and select options.
      This is native browser behaviour from the shared radio name.
    </p>

    <ngx-radio-group
      label="Billing plan"
      hint="You can change plans at any time."
      [required]="true"
      [error]="planError()"
      [(value)]="plan"
      [(touched)]="planTouched"
    >
      <ngx-radio value="free">Free</ngx-radio>
      <ngx-radio value="team">Team</ngx-radio>
      <ngx-radio value="business">Business</ngx-radio>
      <ngx-radio value="legacy" [disabled]="true">Legacy (no longer offered)</ngx-radio>
    </ngx-radio-group>
    <p>Value: {{ plan() ?? 'none' }}</p>

    <ngx-radio-group label="Density" orientation="horizontal" [(value)]="density">
      <ngx-radio value="compact">Compact</ngx-radio>
      <ngx-radio value="comfortable">Comfortable</ngx-radio>
      <ngx-radio value="spacious">Spacious</ngx-radio>
    </ngx-radio-group>

    <ngx-radio-group label="Disabled group" [disabled]="true" value="on">
      <ngx-radio value="on">On</ngx-radio>
      <ngx-radio value="off">Off</ngx-radio>
    </ngx-radio-group>
  `,
})
class RadioGroupShowcase {
  readonly plan = signal<string | null>(null);
  readonly planTouched = signal(false);
  readonly density = signal<string | null>('comfortable');

  readonly planError = computed(() =>
    this.planTouched() && !this.plan() ? 'Choose a billing plan.' : '',
  );
}

const meta: Meta = {
  title: 'Design System/Forms/Radio Group',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Examples: Story = {
  render: () => ({
    moduleMetadata: { imports: [RadioGroupShowcase] },
    template: '<ngx-docs-radio-group-showcase />',
  }),
};
