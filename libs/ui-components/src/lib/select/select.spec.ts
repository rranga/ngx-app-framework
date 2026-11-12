import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Field } from '../field/field';
import { Select, type SelectOption } from './select';

const COUNTRIES: readonly SelectOption[] = [
  { value: 'in', label: 'India' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'xx', label: 'Unavailable region', disabled: true },
];

@Component({
  imports: [Field, Select],
  template: `
    <ngx-field id="country" label="Country" [error]="error()" [required]="true">
      <ngx-select
        name="country"
        [placeholder]="placeholder()"
        [options]="options()"
        [disabled]="disabled()"
        [(value)]="value"
        [(touched)]="touched"
      />
    </ngx-field>
  `,
})
class Host {
  readonly value = signal('');
  readonly options = signal<readonly SelectOption[]>(COUNTRIES);
  readonly placeholder = signal('Choose a country');
  readonly error = signal('');
  readonly disabled = signal(false);
  readonly touched = signal(false);
}

describe('Select', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const select = (): HTMLSelectElement =>
    fixture.nativeElement.querySelector('select');
  const component = (): Select =>
    fixture.debugElement.query((el) => el.componentInstance instanceof Select)
      .componentInstance;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('is labelled by the field and inherits required', () => {
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

    expect(select().id).toBe('country');
    expect(label.control).toBe(select());
    expect(select().required).toBe(true);
    expect(select().name).toBe('country');
  });

  it('renders the placeholder followed by the typed options', () => {
    const options = Array.from(select().options);

    expect(options.map((option) => option.value)).toEqual(['', 'in', 'gb', 'xx']);
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      'Choose a country',
      'India',
      'United Kingdom',
      'Unavailable region',
    ]);
    expect(options[3].disabled).toBe(true);
  });

  it('omits the placeholder option when none is provided', async () => {
    host.placeholder.set('');
    host.value.set('in');
    await fixture.whenStable();

    expect(select().options).toHaveLength(3);
  });

  it('selects the option matching the model value', async () => {
    host.value.set('gb');
    await fixture.whenStable();

    expect(select().value).toBe('gb');
  });

  it('updates the model when the user chooses an option', async () => {
    select().value = 'in';
    select().dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(host.value()).toBe('in');
  });

  it('reports valueMissing until a real option is chosen', async () => {
    expect(component().validity().errors).toEqual(['valueMissing']);

    host.value.set('in');
    await fixture.whenStable();
    expect(component().validity().valid).toBe(true);
  });

  it('keeps the selection when options are replaced', async () => {
    host.value.set('gb');
    await fixture.whenStable();

    host.options.set([...COUNTRIES, { value: 'us', label: 'United States' }]);
    await fixture.whenStable();

    expect(select().value).toBe('gb');
  });

  it('supports the disabled state', async () => {
    host.disabled.set(true);
    await fixture.whenStable();

    expect(select().disabled).toBe(true);
  });

  it('reflects field errors accessibly without stale attributes', async () => {
    host.error.set('Choose a country.');
    await fixture.whenStable();
    expect(select().getAttribute('aria-invalid')).toBe('true');
    expect(select().getAttribute('aria-describedby')).toBe('country-error');

    host.error.set('');
    await fixture.whenStable();
    expect(select().hasAttribute('aria-invalid')).toBe(false);
    expect(select().hasAttribute('aria-describedby')).toBe(false);
  });

  it('marks itself touched on blur', async () => {
    select().dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();

    expect(host.touched()).toBe(true);
  });
});
