import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required } from '@angular/forms/signals';
import { Checkbox } from '../checkbox/checkbox';
import { Input } from '../input/input';
import { Select } from '../select/select';

interface Signup {
  email: string;
  country: string;
  terms: boolean;
}

@Component({
  imports: [FormField, Input, Select, Checkbox],
  template: `
    <ngx-input ariaLabel="Email" [formField]="signupForm.email" />
    <ngx-select
      ariaLabel="Country"
      placeholder="Choose"
      [options]="[{ value: 'in', label: 'India' }]"
      [formField]="signupForm.country"
    />
    <ngx-checkbox [formField]="signupForm.terms">Accept terms</ngx-checkbox>
  `,
})
class SignupHost {
  readonly model = signal<Signup>({ email: '', country: '', terms: false });
  readonly signupForm = form(this.model, (path) => {
    required(path.email);
  });
}

describe('Angular Signal Forms integration', () => {
  it('binds value, required, invalid and touched state through [formField]', async () => {
    const fixture = TestBed.createComponent(SignupHost);
    await fixture.whenStable();

    const host = fixture.componentInstance;
    const email: HTMLInputElement = fixture.nativeElement.querySelector('input:not([type="checkbox"])');
    const country: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    const terms: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(email.required).toBe(true);
    // Pristine fields are not announced as invalid.
    expect(email.hasAttribute('aria-invalid')).toBe(false);

    email.dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();
    expect(host.signupForm.email().touched()).toBe(true);
    expect(email.getAttribute('aria-invalid')).toBe('true');

    email.value = 'person@example.com';
    email.dispatchEvent(new Event('input'));
    country.value = 'in';
    country.dispatchEvent(new Event('change'));
    terms.click();
    await fixture.whenStable();

    expect(host.model()).toEqual({
      email: 'person@example.com',
      country: 'in',
      terms: true,
    });
    expect(email.hasAttribute('aria-invalid')).toBe(false);
  });
});
