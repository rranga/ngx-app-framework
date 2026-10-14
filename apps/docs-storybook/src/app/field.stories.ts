
import { Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Field, FieldControl } from '@rranga/ngx-ui-components';

@Component({
  selector: 'ngx-field-showcase',
  standalone: true,
  imports: [Field, FieldControl],
  template: `
    <div
      style="
        display: grid;
        gap: var(--ngx-space-6);
        max-width: 420px;
        font-family: var(--ngx-font-family-base);
        color: var(--ngx-color-text);
      "
    >
      <ngx-field
        id="name"
        label="Full name"
        hint="Enter your first and last name."
        [required]="true"
      >
        <input
          id="name"
          type="text"
          ngxFieldControl
          placeholder="Jane Doe"
          style="width: 100%; box-sizing: border-box; padding: 10px;"
        />
      </ngx-field>

      <ngx-field
        id="email"
        label="Email address"
        hint="Use your work email."
        [error]="emailError()"
        [required]="true"
      >
        <input
          id="email"
          type="email"
          ngxFieldControl
          placeholder="jane@example.com"
          style="width: 100%; box-sizing: border-box; padding: 10px;"
        />
      </ngx-field>

      <button type="button" (click)="toggleError()">
        Toggle email error
      </button>
    </div>
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
  title: 'Design System/Field',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Examples: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [FieldShowcase],
    },
    template: '<ngx-field-showcase />',
  }),
};
