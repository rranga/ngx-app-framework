import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Field } from '../field/field';
import { Input, type InputType } from './input';

@Component({
  imports: [Field, Input],
  template: `
    <ngx-field
      id="email"
      label="Email address"
      hint="Use your work email."
      [error]="error()"
      [required]="true"
    >
      <ngx-input
        type="email"
        name="email"
        placeholder="name@example.com"
        autocomplete="email"
        inputMode="email"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [describedBy]="extraDescription()"
        [(value)]="value"
        [(touched)]="touched"
        (touch)="touchCount = touchCount + 1"
      />
    </ngx-field>
    <p id="email-extra">Extra description</p>
  `,
})
class FieldHost {
  readonly value = signal('user@example.com');
  readonly error = signal('Enter a valid email address.');
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly extraDescription = signal<string | null>(null);
  readonly touched = signal(false);
  touchCount = 0;
}

@Component({
  imports: [Input],
  template: `
    <ngx-input
      [type]="type()"
      [required]="required()"
      [invalid]="invalid()"
      [minLength]="minLength()"
      [maxLength]="maxLength()"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [pattern]="pattern()"
      ariaLabel="Standalone input"
      [(value)]="value"
      [(touched)]="touched"
    />
  `,
})
class StandaloneHost {
  readonly type = signal<InputType>('text');
  readonly value = signal('');
  readonly required = signal(false);
  readonly invalid = signal(false);
  readonly touched = signal(false);
  readonly minLength = signal<number | undefined>(undefined);
  readonly maxLength = signal<number | undefined>(undefined);
  readonly min = signal<string | number | undefined>(undefined);
  readonly max = signal<string | number | undefined>(undefined);
  readonly step = signal<string | number | undefined>(undefined);
  readonly pattern = signal<string | undefined>(undefined);
}

async function render<T>(component: new () => T): Promise<ComponentFixture<T>> {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  return fixture;
}

function nativeInput(fixture: ComponentFixture<unknown>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input');
}

function inputComponent(fixture: ComponentFixture<unknown>): Input {
  return fixture.debugElement.query(
    (el) => el.componentInstance instanceof Input,
  ).componentInstance;
}

function type(element: HTMLInputElement, text: string): void {
  element.value = text;
  element.dispatchEvent(new Event('input'));
}

describe('Input', () => {
  describe('inside ngx-field', () => {
    let fixture: ComponentFixture<FieldHost>;
    let host: FieldHost;

    beforeEach(async () => {
      fixture = await render(FieldHost);
      host = fixture.componentInstance;
    });

    it('renders the configured type, name, placeholder and autofill hints', () => {
      const input = nativeInput(fixture);

      expect(input.type).toBe('email');
      expect(input.name).toBe('email');
      expect(input.placeholder).toBe('name@example.com');
      expect(input.getAttribute('autocomplete')).toBe('email');
      expect(input.getAttribute('inputmode')).toBe('email');
    });

    it('inherits the field id so the label is associated with the input', () => {
      const input = nativeInput(fixture);
      const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

      expect(input.id).toBe('email');
      expect(label.control).toBe(input);
    });

    it('keeps ids unique by removing them from host elements', () => {
      expect(fixture.nativeElement.querySelectorAll('#email')).toHaveLength(1);
      expect(fixture.nativeElement.querySelector('ngx-input').hasAttribute('id')).toBe(false);
    });

    it('inherits the required state from the field', () => {
      expect(nativeInput(fixture).required).toBe(true);
    });

    it('references the field hint and error and marks the input invalid', () => {
      const input = nativeInput(fixture);

      expect(input.getAttribute('aria-describedby')).toBe('email-hint email-error');
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('merges its own describedBy ids with the field ids without duplicates', async () => {
      host.extraDescription.set('email-extra email-hint');
      await fixture.whenStable();

      expect(nativeInput(fixture).getAttribute('aria-describedby')).toBe(
        'email-hint email-error email-extra',
      );
    });

    it('removes stale aria-invalid and error references when the error clears', async () => {
      host.error.set('');
      await fixture.whenStable();

      const input = nativeInput(fixture);
      expect(input.hasAttribute('aria-invalid')).toBe(false);
      expect(input.getAttribute('aria-describedby')).toBe('email-hint');
    });

    it('displays the bound value', () => {
      expect(nativeInput(fixture).value).toBe('user@example.com');
    });

    it('updates the bound value when the user types', async () => {
      type(nativeInput(fixture), 'new@example.com');
      await fixture.whenStable();

      expect(host.value()).toBe('new@example.com');
    });

    it('writes programmatic model changes to the element', async () => {
      host.value.set('changed@example.com');
      await fixture.whenStable();

      expect(nativeInput(fixture).value).toBe('changed@example.com');
    });

    it('does not rewrite the value the user entered', async () => {
      const input = nativeInput(fixture);
      type(input, 'Mixed.Case@Example.COM');
      await fixture.whenStable();

      expect(host.value()).toBe('Mixed.Case@Example.COM');
      expect(input.value).toBe('Mixed.Case@Example.COM');
    });

    it('supports the disabled and readonly states', async () => {
      host.disabled.set(true);
      host.readonly.set(true);
      await fixture.whenStable();

      expect(nativeInput(fixture).disabled).toBe(true);
      expect(nativeInput(fixture).readOnly).toBe(true);
    });

    it('marks itself touched and emits touch on blur', async () => {
      nativeInput(fixture).dispatchEvent(new FocusEvent('blur'));
      await fixture.whenStable();

      expect(host.touched()).toBe(true);
      expect(host.touchCount).toBe(1);
    });
  });

  describe('standalone', () => {
    let fixture: ComponentFixture<StandaloneHost>;
    let host: StandaloneHost;

    beforeEach(async () => {
      fixture = await render(StandaloneHost);
      host = fixture.componentInstance;
    });

    it.each<InputType>(['text', 'email', 'password', 'number', 'tel', 'url', 'search'])(
      'renders type "%s"',
      async (inputType) => {
        host.type.set(inputType);
        await fixture.whenStable();

        expect(nativeInput(fixture).type).toBe(inputType);
      },
    );

    it('generates an id and uses the provided accessible name', () => {
      const input = nativeInput(fixture);

      expect(input.id).toMatch(/^ngx-input-\d+$/);
      expect(input.getAttribute('aria-label')).toBe('Standalone input');
      expect(input.hasAttribute('aria-describedby')).toBe(false);
    });

    it('does not announce its own invalid state until touched', async () => {
      host.invalid.set(true);
      await fixture.whenStable();
      expect(nativeInput(fixture).hasAttribute('aria-invalid')).toBe(false);

      nativeInput(fixture).dispatchEvent(new FocusEvent('blur'));
      await fixture.whenStable();
      expect(nativeInput(fixture).getAttribute('aria-invalid')).toBe('true');

      host.invalid.set(false);
      await fixture.whenStable();
      expect(nativeInput(fixture).hasAttribute('aria-invalid')).toBe(false);
    });

    it('omits unset constraint attributes', () => {
      const input = nativeInput(fixture);

      for (const attribute of ['minlength', 'maxlength', 'min', 'max', 'step', 'pattern', 'name', 'placeholder', 'autocomplete', 'inputmode']) {
        expect(input.hasAttribute(attribute)).toBe(false);
      }
    });

    it('renders native constraint attributes', async () => {
      host.minLength.set(2);
      host.maxLength.set(20);
      host.min.set(1);
      host.max.set('10');
      host.step.set('any');
      host.pattern.set('[a-z]+');
      await fixture.whenStable();

      const input = nativeInput(fixture);
      expect(input.getAttribute('minlength')).toBe('2');
      expect(input.getAttribute('maxlength')).toBe('20');
      expect(input.getAttribute('min')).toBe('1');
      expect(input.getAttribute('max')).toBe('10');
      expect(input.getAttribute('step')).toBe('any');
      expect(input.getAttribute('pattern')).toBe('[a-z]+');
    });

    it('reports valueMissing for an empty required input and clears it when filled', async () => {
      host.required.set(true);
      await fixture.whenStable();
      expect(inputComponent(fixture).validity()).toEqual({
        valid: false,
        errors: ['valueMissing'],
      });

      type(nativeInput(fixture), 'Ada');
      await fixture.whenStable();
      expect(inputComponent(fixture).validity().valid).toBe(true);
    });

    it('reports typeMismatch for a malformed email', async () => {
      host.type.set('email');
      host.value.set('not-an-email');
      await fixture.whenStable();

      expect(inputComponent(fixture).validity().errors).toEqual(['typeMismatch']);
    });

    describe('telephone pattern policy', () => {
      beforeEach(async () => {
        host.type.set('tel');
        host.pattern.set('\\+?[0-9]{7,15}');
        await fixture.whenStable();
      });

      it.each(['+919876543210', '02079460000'])('accepts "%s"', async (phone) => {
        type(nativeInput(fixture), phone);
        await fixture.whenStable();

        expect(inputComponent(fixture).validity().valid).toBe(true);
      });

      it.each(['98-76', '+44 20 7946 0000', 'call me'])('rejects "%s"', async (phone) => {
        type(nativeInput(fixture), phone);
        await fixture.whenStable();

        expect(inputComponent(fixture).validity().errors).toEqual(['patternMismatch']);
      });

      it('does not strip characters the pattern rejects', async () => {
        type(nativeInput(fixture), '98-76');
        await fixture.whenStable();

        expect(host.value()).toBe('98-76');
      });
    });

    describe('number policy', () => {
      beforeEach(async () => {
        host.type.set('number');
        host.min.set(1);
        host.max.set(10);
        host.step.set(1);
        await fixture.whenStable();
      });

      it.each([
        ['', []],
        ['5', []],
        ['0', ['rangeUnderflow']],
        ['11', ['rangeOverflow']],
        ['2.5', ['stepMismatch']],
      ])('value "%s" reports %j', async (value, errors) => {
        type(nativeInput(fixture), value);
        await fixture.whenStable();

        expect(inputComponent(fixture).validity().errors).toEqual(errors);
      });

      it('keeps the model value as a string', async () => {
        type(nativeInput(fixture), '7');
        await fixture.whenStable();

        expect(host.value()).toBe('7');
      });
    });

    it('re-evaluates validity when constraints change', async () => {
      host.value.set('abc');
      host.pattern.set('[0-9]+');
      await fixture.whenStable();
      expect(inputComponent(fixture).validity().errors).toEqual(['patternMismatch']);

      host.pattern.set(undefined);
      await fixture.whenStable();
      expect(inputComponent(fixture).validity().valid).toBe(true);
    });

    it('moves focus to the native input', () => {
      inputComponent(fixture).focus();

      expect(document.activeElement).toBe(nativeInput(fixture));
    });
  });
});
