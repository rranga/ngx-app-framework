import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Field, Input } from '@rranga/ngx-ui-components';
import { SHOWCASE_STYLES, validationMessage } from './story-helpers';

@Component({
  selector: 'ngx-docs-input-types',
  imports: [Field, Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: SHOWCASE_STYLES,
  template: `
    <ngx-field id="type-text" label="Text">
      <ngx-input placeholder="Jane Doe" autocomplete="name" [(value)]="text" />
    </ngx-field>
    <p>Value: "{{ text() }}"</p>

    <ngx-field id="type-email" label="Email">
      <ngx-input type="email" placeholder="name@example.com" autocomplete="email" [(value)]="email" />
    </ngx-field>

    <ngx-field id="type-password" label="Password">
      <ngx-input type="password" autocomplete="current-password" [(value)]="password" />
    </ngx-field>

    <ngx-field id="type-number" label="Quantity">
      <ngx-input type="number" min="1" max="99" [(value)]="quantity" />
    </ngx-field>
    <p>Value (always a string): "{{ quantity() }}"</p>

    <ngx-field id="type-tel" label="Telephone">
      <ngx-input type="tel" autocomplete="tel" placeholder="+15550100" [(value)]="phone" />
    </ngx-field>

    <ngx-field id="type-url" label="Website">
      <ngx-input type="url" placeholder="https://example.com" autocomplete="url" [(value)]="url" />
    </ngx-field>

    <ngx-field id="type-search" label="Search">
      <ngx-input type="search" placeholder="Search components" [(value)]="search" />
    </ngx-field>
  `,
})
class InputTypesShowcase {
  readonly text = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly quantity = signal('1');
  readonly phone = signal('');
  readonly url = signal('');
  readonly search = signal('');
}

@Component({
  selector: 'ngx-docs-input-states',
  imports: [Field, Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: SHOWCASE_STYLES,
  template: `
    <ngx-field id="state-default" label="Default" hint="Hint text is announced with the input.">
      <ngx-input placeholder="Default input" />
    </ngx-field>

    <ngx-field id="state-required" label="Required" [required]="true">
      <ngx-input placeholder="Required input" />
    </ngx-field>

    <ngx-field id="state-disabled" label="Disabled">
      <ngx-input placeholder="Disabled input" [disabled]="true" />
    </ngx-field>

    <ngx-field id="state-readonly" label="Read only">
      <ngx-input value="This value cannot be edited" [readonly]="true" />
    </ngx-field>

    <ngx-field id="state-invalid" label="Invalid" [error]="error()">
      <ngx-input type="email" value="not-an-email" />
    </ngx-field>
    <button type="button" (click)="toggleError()">Toggle error</button>

    <section>
      <h3>Without a field</h3>
      <ngx-input ariaLabel="Search the documentation" type="search" placeholder="Uses aria-label" />
    </section>
  `,
})
class InputStatesShowcase {
  readonly error = signal('Enter a valid email address.');

  toggleError(): void {
    this.error.update((error) => (error ? '' : 'Enter a valid email address.'));
  }
}

@Component({
  selector: 'ngx-docs-input-validation',
  imports: [Field, Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: SHOWCASE_STYLES,
  template: `
    <p>
      Errors appear after a field is left (touched) or the form is submitted, and clear as soon as the value
      becomes valid. Messages are owned by the application; the library reports validity keys.
    </p>

    <form novalidate (submit)="$event.preventDefault(); submitted.set(true)">
      <ngx-field id="validation-email" label="Work email" [required]="true" [error]="emailError()">
        <ngx-input #emailInput type="email" autocomplete="email" [(value)]="email" [(touched)]="emailTouched" />
      </ngx-field>

      <ngx-field
        id="validation-phone"
        label="Mobile number"
        hint="Digits only, with an optional leading +. Example policy: international formats vary, so adapt the pattern to your audience."
        [error]="phoneError()"
      >
        <ngx-input
          #phoneInput
          type="tel"
          inputMode="tel"
          autocomplete="tel"
          pattern="\\+?[0-9]{7,15}"
          placeholder="+15550100"
          [(value)]="phone"
          [(touched)]="phoneTouched"
        />
      </ngx-field>

      <ngx-field
        id="validation-quantity"
        label="Seats"
        hint="Between 1 and 50, whole numbers only."
        [error]="quantityError()"
      >
        <ngx-input
          #quantityInput
          type="number"
          inputMode="numeric"
          min="1"
          max="50"
          step="1"
          [(value)]="quantity"
          [(touched)]="quantityTouched"
        />
      </ngx-field>

      <button type="submit">Submit</button>
    </form>
  `,
})
class InputValidationShowcase {
  private readonly emailInput = viewChild.required<Input>('emailInput');
  private readonly phoneInput = viewChild.required<Input>('phoneInput');
  private readonly quantityInput = viewChild.required<Input>('quantityInput');

  readonly submitted = signal(false);
  readonly email = signal('');
  readonly emailTouched = signal(false);
  readonly phone = signal('');
  readonly phoneTouched = signal(false);
  readonly quantity = signal('');
  readonly quantityTouched = signal(false);

  readonly emailError = computed(() =>
    this.submitted() || this.emailTouched()
      ? validationMessage(this.emailInput().validity(), {
          valueMissing: 'Enter your work email.',
          typeMismatch: 'Enter an email address like name@example.com.',
        })
      : '',
  );

  readonly phoneError = computed(() =>
    this.submitted() || this.phoneTouched()
      ? validationMessage(this.phoneInput().validity(), {
          patternMismatch: 'Use 7–15 digits, optionally starting with +.',
        })
      : '',
  );

  readonly quantityError = computed(() =>
    this.submitted() || this.quantityTouched()
      ? validationMessage(this.quantityInput().validity(), {
          badInput: 'Enter a number.',
          rangeUnderflow: 'Choose at least 1 seat.',
          rangeOverflow: 'Choose at most 50 seats.',
          stepMismatch: 'Use a whole number of seats.',
        })
      : '',
  );
}

const meta: Meta = {
  title: 'Design System/Forms/Input',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const AllInputTypes: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputTypesShowcase] },
    template: '<ngx-docs-input-types />',
  }),
};

export const States: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputStatesShowcase] },
    template: '<ngx-docs-input-states />',
  }),
};

export const Validation: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputValidationShowcase] },
    template: '<ngx-docs-input-validation />',
  }),
};
