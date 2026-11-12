import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Radio } from './radio';
import { RadioGroup } from './radio-group';

@Component({
  imports: [RadioGroup, Radio],
  template: `
    <ngx-radio-group
      id="plan"
      label="Plan"
      hint="You can change plans later."
      [error]="error()"
      [required]="required()"
      [disabled]="disabled()"
      [invalid]="invalidState()"
      [(value)]="value"
      [(touched)]="touched"
    >
      <ngx-radio value="free">Free</ngx-radio>
      <ngx-radio value="pro">Pro</ngx-radio>
      <ngx-radio value="enterprise" [disabled]="true">Enterprise</ngx-radio>
    </ngx-radio-group>
  `,
})
class Host {
  readonly value = signal<string | null>(null);
  readonly error = signal('');
  readonly required = signal(false);
  readonly disabled = signal(false);
  readonly invalidState = signal(false);
  readonly touched = signal(false);
}

describe('RadioGroup', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const radios = (): HTMLInputElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
  const fieldset = (): HTMLFieldSetElement =>
    fixture.nativeElement.querySelector('fieldset');

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('renders a labelled radiogroup', () => {
    const legend: HTMLLegendElement = fixture.nativeElement.querySelector('legend');

    expect(fieldset().getAttribute('role')).toBe('radiogroup');
    expect(legend.textContent?.trim()).toBe('Plan');
    expect(fieldset().getAttribute('aria-labelledby')).toBe(legend.id);
    expect(fixture.nativeElement.querySelector('ngx-radio-group').hasAttribute('id')).toBe(false);
  });

  it('gives every radio the same name so the browser groups them', () => {
    const names = new Set(radios().map((radio) => radio.name));

    expect(names.size).toBe(1);
    expect([...names][0]).toBe('plan');
  });

  it('labels each radio with its projected content', () => {
    const labels: HTMLLabelElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('label'),
    );

    expect(labels.map((label) => label.textContent?.trim())).toEqual([
      'Free',
      'Pro',
      'Enterprise',
    ]);
    labels.forEach((label, index) => expect(label.control).toBe(radios()[index]));
  });

  it('checks the radio matching the model value', async () => {
    host.value.set('pro');
    await fixture.whenStable();

    expect(radios().map((radio) => radio.checked)).toEqual([false, true, false]);
  });

  it('updates the model and keeps a single selection when the user picks an option', async () => {
    radios()[0].click();
    await fixture.whenStable();
    expect(host.value()).toBe('free');

    radios()[1].click();
    await fixture.whenStable();
    expect(host.value()).toBe('pro');
    expect(radios().filter((radio) => radio.checked)).toHaveLength(1);
  });

  it('supports disabled options and a disabled group', async () => {
    expect(radios()[2].disabled).toBe(true);
    expect(radios()[0].disabled).toBe(false);

    host.disabled.set(true);
    await fixture.whenStable();
    expect(fieldset().disabled).toBe(true);
  });

  it('applies required semantics to the group and each radio', async () => {
    host.required.set(true);
    await fixture.whenStable();

    expect(fieldset().getAttribute('aria-required')).toBe('true');
    expect(radios().every((radio) => radio.required)).toBe(true);
    expect(radios()[0].validity.valueMissing).toBe(true);
  });

  it('describes the group with hint and error and clears stale state', async () => {
    expect(fieldset().getAttribute('aria-describedby')).toBe('plan-hint');
    expect(fieldset().hasAttribute('aria-invalid')).toBe(false);

    host.error.set('Choose a plan.');
    await fixture.whenStable();
    expect(fieldset().getAttribute('aria-describedby')).toBe('plan-hint plan-error');
    expect(fieldset().getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('#plan-error').getAttribute('role')).toBe('alert');

    host.error.set('');
    await fixture.whenStable();
    expect(fieldset().getAttribute('aria-describedby')).toBe('plan-hint');
    expect(fieldset().hasAttribute('aria-invalid')).toBe(false);
  });

  it('presents its own invalid state only once touched', async () => {
    host.invalidState.set(true);
    await fixture.whenStable();
    expect(fieldset().hasAttribute('aria-invalid')).toBe(false);

    host.touched.set(true);
    await fixture.whenStable();
    expect(fieldset().getAttribute('aria-invalid')).toBe('true');
  });

  it('marks the group touched when an option loses focus', async () => {
    radios()[0].dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();

    expect(host.touched()).toBe(true);
  });
});
