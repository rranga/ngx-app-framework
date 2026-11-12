import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkbox } from './checkbox';

@Component({
  imports: [Checkbox],
  template: `
    <ngx-checkbox
      id="terms"
      name="terms"
      [required]="required()"
      [disabled]="disabled()"
      [invalid]="invalid()"
      describedBy="terms-error"
      [(checked)]="checked"
      [(indeterminate)]="indeterminate"
      [(touched)]="touched"
    >
      I accept the terms
    </ngx-checkbox>
    <p id="terms-error">You must accept the terms.</p>
  `,
})
class Host {
  readonly checked = signal(false);
  readonly indeterminate = signal(false);
  readonly required = signal(false);
  readonly disabled = signal(false);
  readonly invalid = signal(false);
  readonly touched = signal(false);
}

describe('Checkbox', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const checkbox = (): HTMLInputElement =>
    fixture.nativeElement.querySelector('input[type="checkbox"]');
  const component = (): Checkbox =>
    fixture.debugElement.query((el) => el.componentInstance instanceof Checkbox)
      .componentInstance;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('is labelled by its projected content and keeps ids unique', () => {
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

    expect(label.textContent?.trim()).toBe('I accept the terms');
    expect(label.control).toBe(checkbox());
    expect(fixture.nativeElement.querySelectorAll('#terms')).toHaveLength(1);
    expect(checkbox().name).toBe('terms');
  });

  it('reflects the checked model', async () => {
    host.checked.set(true);
    await fixture.whenStable();

    expect(checkbox().checked).toBe(true);
  });

  it('updates the checked model as a boolean when clicked', async () => {
    checkbox().click();
    await fixture.whenStable();
    expect(host.checked()).toBe(true);

    checkbox().click();
    await fixture.whenStable();
    expect(host.checked()).toBe(false);
  });

  it('supports the indeterminate state and clears it on toggle', async () => {
    host.indeterminate.set(true);
    await fixture.whenStable();
    expect(checkbox().indeterminate).toBe(true);

    checkbox().click();
    await fixture.whenStable();
    expect(host.indeterminate()).toBe(false);
    expect(host.checked()).toBe(true);
  });

  it('supports required and reports valueMissing until checked', async () => {
    host.required.set(true);
    await fixture.whenStable();
    expect(checkbox().required).toBe(true);
    expect(component().validity().errors).toEqual(['valueMissing']);

    checkbox().click();
    await fixture.whenStable();
    expect(component().validity().valid).toBe(true);
  });

  it('supports the disabled state', async () => {
    host.disabled.set(true);
    await fixture.whenStable();

    expect(checkbox().disabled).toBe(true);
  });

  it('describes itself and presents aria-invalid only once touched', async () => {
    expect(checkbox().getAttribute('aria-describedby')).toBe('terms-error');

    host.invalid.set(true);
    await fixture.whenStable();
    expect(checkbox().hasAttribute('aria-invalid')).toBe(false);

    host.touched.set(true);
    await fixture.whenStable();
    expect(checkbox().getAttribute('aria-invalid')).toBe('true');

    host.invalid.set(false);
    await fixture.whenStable();
    expect(checkbox().hasAttribute('aria-invalid')).toBe(false);
  });

  it('marks itself touched on blur', async () => {
    checkbox().dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();

    expect(host.touched()).toBe(true);
  });
});
