import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Field, Select, type SelectOption } from '@rranga/ngx-ui-components';
import { SHOWCASE_STYLES } from './story-helpers';

const REGIONS: readonly SelectOption[] = [
  { value: 'emea', label: 'Europe, Middle East & Africa' },
  { value: 'amer', label: 'Americas' },
  { value: 'apac', label: 'Asia Pacific' },
  { value: 'gov', label: 'Government cloud (unavailable)', disabled: true },
];

@Component({
  selector: 'ngx-docs-select-showcase',
  imports: [Field, Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: SHOWCASE_STYLES,
  template: `
    <ngx-field id="select-region" label="Data region" [required]="true" [error]="regionError()">
      <ngx-select
        placeholder="Choose a region"
        [options]="regions"
        [(value)]="region"
        [(touched)]="regionTouched"
      />
    </ngx-field>
    <p>Value: "{{ region() }}"</p>

    <ngx-field id="select-preselected" label="Without placeholder" hint="The model is initialised to the first option.">
      <ngx-select [options]="regions" [(value)]="preselected" />
    </ngx-field>

    <ngx-field id="select-disabled" label="Disabled">
      <ngx-select [options]="regions" value="amer" [disabled]="true" />
    </ngx-field>
  `,
})
class SelectShowcase {
  readonly regions = REGIONS;
  readonly region = signal('');
  readonly regionTouched = signal(false);
  readonly preselected = signal(REGIONS[0].value);

  readonly regionError = computed(() =>
    this.regionTouched() && !this.region() ? 'Choose where your data is stored.' : '',
  );
}

const meta: Meta = {
  title: 'Design System/Forms/Select',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Examples: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectShowcase] },
    template: '<ngx-docs-select-showcase />',
  }),
};
