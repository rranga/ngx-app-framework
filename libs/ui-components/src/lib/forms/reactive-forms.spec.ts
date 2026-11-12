import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Checkbox } from '../checkbox/checkbox';
import { Field } from '../field/field';
import { Input } from '../input/input';
import { Radio } from '../radio-group/radio';
import { RadioGroup } from '../radio-group/radio-group';
import { Select, type SelectOption } from '../select/select';
import { Textarea } from '../textarea/textarea';
import { FormControlAccessor } from './form-control-accessor';

const COUNTRIES: readonly SelectOption[] = [
  { value: 'in', label: 'India' },
  { value: 'gb', label: 'United Kingdom' },
];

@Component({
  imports: [
    ReactiveFormsModule,
    FormControlAccessor,
    Field,
    Input,
    Textarea,
    Select,
    Checkbox,
    RadioGroup,
    Radio,
  ],
  template: `
    <form [formGroup]="form">
      <ngx-field id="email" label="Email">
        <ngx-input type="email" formControlName="email" />
      </ngx-field>
      <ngx-field id="bio" label="Bio">
        <ngx-textarea formControlName="bio" />
      </ngx-field>
      <ngx-field id="country" label="Country">
        <ngx-select placeholder="Choose" [options]="countries" formControlName="country" />
      </ngx-field>
      <ngx-checkbox formControlName="terms">Accept terms</ngx-checkbox>
      <ngx-radio-group label="Plan" formControlName="plan">
        <ngx-radio value="free">Free</ngx-radio>
        <ngx-radio value="pro">Pro</ngx-radio>
      </ngx-radio-group>
      <button type="submit">Submit</button>
    </form>
  `,
})
class ReactiveHost {
  readonly formDirective = viewChild.required(FormGroupDirective);
  readonly countries = COUNTRIES;
  readonly form = new FormGroup({
    email: new FormControl('ada@example.com', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    bio: new FormControl<string | null>('Hello'),
    country: new FormControl<string | null>('gb'),
    terms: new FormControl(false, { validators: Validators.requiredTrue }),
    plan: new FormControl<string | null>('pro'),
  });
}

@Component({
  imports: [ReactiveFormsModule, FormControlAccessor, Input],
  template: `<ngx-input ariaLabel="Code" [formControl]="control()" />`,
})
class StandaloneControlHost {
  readonly first = new FormControl('first', Validators.required);
  readonly second = new FormControl('', Validators.required);
  readonly control = signal(this.first);
}

@Component({
  imports: [FormsModule, FormControlAccessor, Input, Checkbox],
  template: `
    <form>
      <ngx-input name="nickname" ariaLabel="Nickname" required [(ngModel)]="nickname" />
      <ngx-checkbox name="terms" required [(ngModel)]="terms">Accept terms</ngx-checkbox>
    </form>
  `,
})
class TemplateDrivenHost {
  readonly ngForm = viewChild.required(NgForm);
  nickname = 'Ada';
  terms = false;
}

function query<T extends Element>(fixture: ComponentFixture<unknown>, selector: string): T {
  return fixture.nativeElement.querySelector(selector);
}

function blur(element: HTMLElement): void {
  element.dispatchEvent(new FocusEvent('blur'));
}

describe('FormControlAccessor', () => {
  describe('Reactive Forms (formControlName)', () => {
    let fixture: ComponentFixture<ReactiveHost>;
    let form: ReactiveHost['form'];

    const email = () => query<HTMLInputElement>(fixture, '#email');
    const bio = () => query<HTMLTextAreaElement>(fixture, 'textarea');
    const country = () => query<HTMLSelectElement>(fixture, 'select');
    const terms = () => query<HTMLInputElement>(fixture, 'input[type="checkbox"]');
    const radios = () =>
      Array.from<HTMLInputElement>(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
    const checkedPlan = () => radios().find((radio) => radio.checked)?.value ?? null;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ReactiveHost);
      form = fixture.componentInstance.form;
      await fixture.whenStable();
    });

    it('writes the initial form values to every control', () => {
      expect(email().value).toBe('ada@example.com');
      expect(bio().value).toBe('Hello');
      expect(country().value).toBe('gb');
      expect(terms().checked).toBe(false);
      expect(checkedPlan()).toBe('pro');
    });

    it('reports user changes to the form and marks controls dirty', async () => {
      email().value = 'grace@example.com';
      email().dispatchEvent(new Event('input'));
      bio().value = 'Updated';
      bio().dispatchEvent(new Event('input'));
      country().value = 'in';
      country().dispatchEvent(new Event('change'));
      terms().click();
      radios()[0].click();
      await fixture.whenStable();

      expect(form.getRawValue()).toEqual({
        email: 'grace@example.com',
        bio: 'Updated',
        country: 'in',
        terms: true,
        plan: 'free',
      });
      expect(form.dirty).toBe(true);
    });

    it('applies programmatic values without marking controls dirty', async () => {
      form.setValue({
        email: 'new@example.com',
        bio: 'Set in code',
        country: 'in',
        terms: true,
        plan: 'free',
      });
      await fixture.whenStable();

      expect(email().value).toBe('new@example.com');
      expect(bio().value).toBe('Set in code');
      expect(country().value).toBe('in');
      expect(terms().checked).toBe(true);
      expect(checkedPlan()).toBe('free');
      expect(form.dirty).toBe(false);
    });

    it('maps null values from reset() to empty controls', async () => {
      form.reset();
      await fixture.whenStable();

      expect(email().value).toBe('ada@example.com'); // non-nullable resets to its initial value
      expect(bio().value).toBe('');
      expect(country().value).toBe('');
      expect(terms().checked).toBe(false);
      expect(checkedPlan()).toBeNull();
    });

    it('marks controls touched on blur', async () => {
      blur(email());
      blur(radios()[1]);
      await fixture.whenStable();

      expect(form.controls.email.touched).toBe(true);
      expect(form.controls.plan.touched).toBe(true);
      expect(form.controls.bio.touched).toBe(false);
    });

    it('follows disable() and enable()', async () => {
      form.disable();
      await fixture.whenStable();

      expect(email().disabled).toBe(true);
      expect(bio().disabled).toBe(true);
      expect(country().disabled).toBe(true);
      expect(terms().disabled).toBe(true);
      expect(query<HTMLFieldSetElement>(fixture, 'fieldset').disabled).toBe(true);

      form.enable();
      await fixture.whenStable();
      expect(email().disabled).toBe(false);
      expect(query<HTMLFieldSetElement>(fixture, 'fieldset').disabled).toBe(false);
    });

    it('reflects required validators as native required', () => {
      expect(email().required).toBe(true);
      expect(terms().required).toBe(true);
      expect(bio().required).toBe(false);
    });

    it('presents invalid state only after touch, and clears it on reset', async () => {
      form.controls.email.setValue('');
      await fixture.whenStable();
      expect(email().hasAttribute('aria-invalid')).toBe(false);

      form.markAllAsTouched();
      await fixture.whenStable();
      expect(email().getAttribute('aria-invalid')).toBe('true');
      expect(terms().getAttribute('aria-invalid')).toBe('true');

      form.reset();
      await fixture.whenStable();
      expect(email().hasAttribute('aria-invalid')).toBe(false);
      expect(terms().hasAttribute('aria-invalid')).toBe(false);
    });

    it('presents invalid state after the form is submitted', async () => {
      form.controls.email.setValue('not-an-email');
      await fixture.whenStable();
      expect(email().hasAttribute('aria-invalid')).toBe(false);

      query<HTMLButtonElement>(fixture, 'button').click();
      await fixture.whenStable();
      expect(email().getAttribute('aria-invalid')).toBe('true');
    });

    it('clears submitted error presentation on resetForm()', async () => {
      form.controls.email.setValue('');
      query<HTMLButtonElement>(fixture, 'button').click();
      await fixture.whenStable();
      expect(email().getAttribute('aria-invalid')).toBe('true');

      // resetForm() resets controls before clearing `submitted`.
      fixture.componentInstance.formDirective().resetForm();
      await fixture.whenStable();
      expect(fixture.componentInstance.formDirective().submitted).toBe(false);
      expect(email().hasAttribute('aria-invalid')).toBe(false);
      expect(terms().hasAttribute('aria-invalid')).toBe(false);
    });

    it('clears the presented error when the value becomes valid', async () => {
      form.controls.email.setValue('');
      form.markAllAsTouched();
      await fixture.whenStable();
      expect(email().getAttribute('aria-invalid')).toBe('true');

      email().value = 'fixed@example.com';
      email().dispatchEvent(new Event('input'));
      await fixture.whenStable();
      expect(email().hasAttribute('aria-invalid')).toBe(false);
    });
  });

  describe('Reactive Forms ([formControl])', () => {
    it('rebinds value and state when the control instance changes', async () => {
      const fixture = TestBed.createComponent(StandaloneControlHost);
      const host = fixture.componentInstance;
      await fixture.whenStable();
      const element = query<HTMLInputElement>(fixture, 'input');

      expect(element.value).toBe('first');

      host.second.markAsTouched();
      host.control.set(host.second);
      await fixture.whenStable();
      expect(element.value).toBe('');
      expect(element.getAttribute('aria-invalid')).toBe('true');

      // The previous control no longer drives the input.
      host.first.setValue('stale');
      host.first.disable();
      await fixture.whenStable();
      expect(element.value).toBe('');
      expect(element.disabled).toBe(false);

      element.value = 'typed';
      element.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      expect(host.second.value).toBe('typed');
      expect(host.first.value).toBe('stale');
    });
  });

  describe('template-driven forms (ngModel)', () => {
    let fixture: ComponentFixture<TemplateDrivenHost>;
    let host: TemplateDrivenHost;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TemplateDrivenHost);
      host = fixture.componentInstance;
      await fixture.whenStable();
      await fixture.whenStable();
    });

    it('binds values in both directions', async () => {
      const nickname = query<HTMLInputElement>(fixture, 'input:not([type="checkbox"])');
      expect(nickname.value).toBe('Ada');

      nickname.value = 'Grace';
      nickname.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      expect(host.nickname).toBe('Grace');
    });

    it('requires a required checkbox to be checked', async () => {
      const terms = host.ngForm().controls['terms'];
      expect(terms.errors).toEqual({ required: true });

      query<HTMLInputElement>(fixture, 'input[type="checkbox"]').click();
      await fixture.whenStable();
      expect(host.terms).toBe(true);
      expect(terms.valid).toBe(true);
    });
  });
});
