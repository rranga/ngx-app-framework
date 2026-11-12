import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  minLength,
  required,
  submit,
  type FieldTree,
} from '@angular/forms/signals';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  Checkbox,
  Field,
  Input,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  type SelectOption,
} from '@rranga/ngx-ui-components';
import { SHOWCASE_STYLES } from './story-helpers';

interface ContactRequest {
  name: string;
  email: string;
  topic: string;
  priority: string | null;
  message: string;
  subscribe: boolean;
}

const TOPICS: readonly SelectOption[] = [
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical support' },
  { value: 'other', label: 'Something else' },
];

const EMPTY_REQUEST: ContactRequest = {
  name: '',
  email: '',
  topic: '',
  priority: null,
  message: '',
  subscribe: false,
};

@Component({
  selector: 'ngx-docs-signal-forms-showcase',
  imports: [JsonPipe, FormField, Field, Input, Select, Textarea, Checkbox, RadioGroup, Radio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    SHOWCASE_STYLES,
    `
      pre {
        margin: 0;
        padding: var(--ngx-space-4);
        overflow-x: auto;
        font-size: var(--ngx-font-size-sm);
        background: var(--ngx-color-surface);
        border-radius: var(--ngx-radius-md);
      }
    `,
  ],
  template: `
    <p>
      Every Tier-1 control binds to Angular Signal Forms with [formField]. Value, required, invalid and
      touched state flow automatically; error text is chosen by the application.
    </p>

    <form novalidate (submit)="onSubmit($event)">
      <ngx-field id="contact-name" label="Name" [required]="true" [error]="errorFor(contactForm.name)">
        <ngx-input autocomplete="name" [formField]="contactForm.name" />
      </ngx-field>

      <ngx-field id="contact-email" label="Email" [required]="true" [error]="errorFor(contactForm.email)">
        <ngx-input type="email" autocomplete="email" [formField]="contactForm.email" />
      </ngx-field>

      <ngx-field id="contact-topic" label="Topic" [required]="true" [error]="errorFor(contactForm.topic)">
        <ngx-select placeholder="Choose a topic" [options]="topics" [formField]="contactForm.topic" />
      </ngx-field>

      <ngx-radio-group
        label="Priority"
        orientation="horizontal"
        [required]="true"
        [error]="errorFor(contactForm.priority)"
        [formField]="contactForm.priority"
      >
        <ngx-radio value="low">Low</ngx-radio>
        <ngx-radio value="normal">Normal</ngx-radio>
        <ngx-radio value="high">High</ngx-radio>
      </ngx-radio-group>

      <ngx-field id="contact-message" label="Message" [required]="true" [error]="errorFor(contactForm.message)">
        <ngx-textarea [rows]="4" [formField]="contactForm.message" />
      </ngx-field>

      <ngx-checkbox [formField]="contactForm.subscribe">Email me product updates</ngx-checkbox>

      <button type="submit">Send request</button>
    </form>

    <section>
      <h3>Model</h3>
      <pre>{{ model() | json }}</pre>
      @if (lastSubmitted(); as submitted) {
        <p role="status">Submitted request from {{ submitted.name }}.</p>
      }
    </section>
  `,
})
class SignalFormsShowcase {
  readonly topics = TOPICS;
  readonly model = signal<ContactRequest>({ ...EMPTY_REQUEST });
  readonly lastSubmitted = signal<ContactRequest | null>(null);

  readonly contactForm = form(this.model, (path) => {
    required(path.name, { message: 'Enter your name.' });
    required(path.email, { message: 'Enter your email address.' });
    email(path.email, { message: 'Enter an email address like name@example.com.' });
    required(path.topic, { message: 'Choose a topic.' });
    required(path.priority, { message: 'Choose a priority.' });
    required(path.message, { message: 'Describe your request.' });
    minLength(path.message, 20, { message: 'Write at least 20 characters.' });
  });

  /** Shows the first error message once the user has interacted with the field. */
  errorFor<T>(field: FieldTree<T>): string {
    const state = field();
    return state.touched() ? (state.errors()[0]?.message ?? '') : '';
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    void submit(this.contactForm, async () => {
      this.lastSubmitted.set(this.model());
      this.model.set({ ...EMPTY_REQUEST });
      this.contactForm().reset();
      return undefined;
    });
  }
}

const meta: Meta = {
  title: 'Design System/Forms/Signal Forms Integration',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const ContactForm: Story = {
  render: () => ({
    moduleMetadata: { imports: [SignalFormsShowcase] },
    template: '<ngx-docs-signal-forms-showcase />',
  }),
};
