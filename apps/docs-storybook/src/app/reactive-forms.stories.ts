import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
} from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  Checkbox,
  Field,
  FormControlAccessor,
  Input,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  type SelectOption,
} from '@rranga/ngx-ui-components';
import { map } from 'rxjs';
import { SHOWCASE_STYLES } from './story-helpers';

const TOPICS: readonly SelectOption[] = [
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical support' },
  { value: 'other', label: 'Something else' },
];

/** Application-owned messages for Angular validator error keys. */
const MESSAGES: Record<string, string> = {
  required: 'This field is required.',
  email: 'Enter an email address like name@example.com.',
  minlength: 'Write at least 20 characters.',
};

@Component({
  selector: 'ngx-docs-reactive-forms-showcase',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    FormControlAccessor,
    Field,
    Input,
    Select,
    Textarea,
    Checkbox,
    RadioGroup,
    Radio,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    SHOWCASE_STYLES,
    `
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ngx-space-2);
      }
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
      Import FormControlAccessor next to the controls to use formControlName, [formControl] or ngModel.
      Disabled, required, touched and submitted state flow from the FormGroup.
    </p>

    <form novalidate [formGroup]="contactForm" (ngSubmit)="onSubmit()" #formDirective="ngForm">
      <ngx-field id="reactive-name" label="Name" [required]="true" [error]="errorFor(contactForm.controls.name, formDirective)">
        <ngx-input autocomplete="name" formControlName="name" />
      </ngx-field>

      <ngx-field id="reactive-email" label="Email" [required]="true" [error]="errorFor(contactForm.controls.email, formDirective)">
        <ngx-input type="email" autocomplete="email" formControlName="email" />
      </ngx-field>

      <ngx-field id="reactive-topic" label="Topic" [required]="true" [error]="errorFor(contactForm.controls.topic, formDirective)">
        <ngx-select placeholder="Choose a topic" [options]="topics" formControlName="topic" />
      </ngx-field>

      <ngx-radio-group
        label="Priority"
        orientation="horizontal"
        [error]="errorFor(contactForm.controls.priority, formDirective)"
        formControlName="priority"
      >
        <ngx-radio value="low">Low</ngx-radio>
        <ngx-radio value="normal">Normal</ngx-radio>
        <ngx-radio value="high">High</ngx-radio>
      </ngx-radio-group>

      <ngx-field id="reactive-message" label="Message" [required]="true" [error]="errorFor(contactForm.controls.message, formDirective)">
        <ngx-textarea [rows]="4" formControlName="message" />
      </ngx-field>

      <ngx-checkbox formControlName="subscribe">Email me product updates</ngx-checkbox>

      <div class="actions">
        <button type="submit">Send request</button>
        <button type="button" (click)="formDirective.resetForm()">Reset</button>
        <button type="button" (click)="fillExample()">Fill example</button>
        <button type="button" (click)="toggleDisabled()">{{ contactForm.disabled ? 'Enable' : 'Disable' }} form</button>
      </div>
    </form>

    <section>
      <h3>Form value</h3>
      <pre>{{ value() | json }}</pre>
      @if (lastSubmitted(); as submitted) {
        <p role="status">Submitted request from {{ submitted.name }}.</p>
      }
    </section>
  `,
})
class ReactiveFormsShowcase {
  readonly topics = TOPICS;
  readonly lastSubmitted = signal<{ name: string } | null>(null);

  readonly contactForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    topic: new FormControl('', { nonNullable: true, validators: Validators.required }),
    priority: new FormControl<string | null>(null, Validators.required),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    subscribe: new FormControl(false, { nonNullable: true }),
  });

  readonly value = toSignal(
    this.contactForm.valueChanges.pipe(map(() => this.contactForm.getRawValue())),
    { initialValue: this.contactForm.getRawValue() },
  );

  /** Shows the first error once the control is touched or the form submitted. */
  errorFor(control: AbstractControl, form: FormGroupDirective): string {
    if (!control.invalid || !(control.touched || form.submitted)) {
      return '';
    }
    const [key] = Object.keys(control.errors ?? {});
    return MESSAGES[key] ?? 'Check this field.';
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.lastSubmitted.set({ name: this.contactForm.getRawValue().name });
    }
  }

  fillExample(): void {
    this.contactForm.patchValue({
      name: 'Sam Example',
      email: 'sam@example.com',
      topic: 'technical',
      priority: 'normal',
      message: 'The export button times out on large reports.',
    });
  }

  toggleDisabled(): void {
    if (this.contactForm.disabled) {
      this.contactForm.enable();
    } else {
      this.contactForm.disable();
    }
  }
}

const meta: Meta = {
  title: 'Design System/Forms/Reactive Forms Integration',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const ContactForm: Story = {
  render: () => ({
    moduleMetadata: { imports: [ReactiveFormsShowcase] },
    template: '<ngx-docs-reactive-forms-showcase />',
  }),
};
