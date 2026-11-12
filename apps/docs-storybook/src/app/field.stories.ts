import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Field, FieldControl, Input } from '@rranga/ngx-ui-components';
import { SHOWCASE_STYLES } from './story-helpers';

@Component({
  selector: 'ngx-docs-field-showcase',
  imports: [Field, FieldControl, Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    SHOWCASE_STYLES,
    `
      .native-control {
        box-sizing: border-box;
        width: 100%;
        padding: var(--ngx-space-3);
        font: inherit;
        border: var(--ngx-border-width) solid var(--ngx-field-control-border, var(--ngx-color-border));
        border-radius: var(--ngx-radius-md);
      }
    `,
  ],
  template: `
    <section>
      <h3>With a library control</h3>
      <p>ngx-input inherits the id, hint, error and required state automatically.</p>
      <ngx-field
        id="field-name"
        label="Full name"
        hint="Enter your first and last name."
        [required]="true"
      >
        <ngx-input placeholder="Jane Doe" autocomplete="name" />
      </ngx-field>
    </section>

    <section>
      <h3>With a native control</h3>
      <p>Native elements opt in with the ngxFieldControl directive.</p>
      <ngx-field
        id="field-email"
        label="Email address"
        hint="Use your work email."
        [error]="emailError()"
        [required]="true"
      >
        <input
          id="field-email"
          class="native-control"
          type="email"
          ngxFieldControl
          placeholder="jane@example.com"
        />
      </ngx-field>
      <button type="button" (click)="toggleError()">Toggle email error</button>
    </section>
  `,
})
class FieldShowcase {
  readonly emailError = signal('Enter a valid email address.');

  toggleError(): void {
    this.emailError.update((error) =>
      error ? '' : 'Enter a valid email address.',
    );
  }
}

const meta: Meta = {
  title: 'Design System/Forms/Field',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Examples: Story = {
  render: () => ({
    moduleMetadata: { imports: [FieldShowcase] },
    template: '<ngx-docs-field-showcase />',
  }),
};
