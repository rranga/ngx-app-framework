import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Field } from '../field/field';
import { Textarea, type TextareaResize } from './textarea';

@Component({
  imports: [Field, Textarea],
  template: `
    <ngx-field id="bio" label="Bio" hint="Max 200 characters." [error]="error()">
      <ngx-textarea
        name="bio"
        placeholder="Tell us about yourself"
        [rows]="rows()"
        [resize]="resize()"
        [required]="required()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [minLength]="10"
        [maxLength]="200"
        [(value)]="value"
        [(touched)]="touched"
      />
    </ngx-field>
  `,
})
class Host {
  readonly value = signal('');
  readonly error = signal('');
  readonly rows = signal(4);
  readonly resize = signal<TextareaResize>('vertical');
  readonly required = signal(false);
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly touched = signal(false);
}

describe('Textarea', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const textarea = (): HTMLTextAreaElement =>
    fixture.nativeElement.querySelector('textarea');
  const component = (): Textarea =>
    fixture.debugElement.query((el) => el.componentInstance instanceof Textarea)
      .componentInstance;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('is labelled by the field and keeps ids unique', () => {
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

    expect(textarea().id).toBe('bio');
    expect(label.control).toBe(textarea());
    expect(fixture.nativeElement.querySelectorAll('#bio')).toHaveLength(1);
  });

  it('renders native attributes', () => {
    const element = textarea();

    expect(element.name).toBe('bio');
    expect(element.placeholder).toBe('Tell us about yourself');
    expect(element.rows).toBe(4);
    expect(element.getAttribute('minlength')).toBe('10');
    expect(element.getAttribute('maxlength')).toBe('200');
    expect(element.style.resize).toBe('vertical');
  });

  it('applies the resize policy', async () => {
    host.resize.set('none');
    await fixture.whenStable();

    expect(textarea().style.resize).toBe('none');
  });

  it('syncs the value in both directions', async () => {
    host.value.set('Line one\nLine two');
    await fixture.whenStable();
    expect(textarea().value).toBe('Line one\nLine two');

    textarea().value = 'Typed text';
    textarea().dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.value()).toBe('Typed text');
  });

  it('supports required, disabled and readonly', async () => {
    host.required.set(true);
    host.disabled.set(true);
    host.readonly.set(true);
    await fixture.whenStable();

    expect(textarea().required).toBe(true);
    expect(textarea().disabled).toBe(true);
    expect(textarea().readOnly).toBe(true);
  });

  it('reports valueMissing when required and empty', async () => {
    host.required.set(true);
    await fixture.whenStable();

    expect(component().validity().errors).toEqual(['valueMissing']);
  });

  it('reflects field errors accessibly and clears them', async () => {
    expect(textarea().getAttribute('aria-describedby')).toBe('bio-hint');
    expect(textarea().hasAttribute('aria-invalid')).toBe(false);

    host.error.set('Bio is too short.');
    await fixture.whenStable();
    expect(textarea().getAttribute('aria-describedby')).toBe('bio-hint bio-error');
    expect(textarea().getAttribute('aria-invalid')).toBe('true');

    host.error.set('');
    await fixture.whenStable();
    expect(textarea().hasAttribute('aria-invalid')).toBe(false);
  });

  it('marks itself touched on blur', async () => {
    textarea().dispatchEvent(new FocusEvent('blur'));
    await fixture.whenStable();

    expect(host.touched()).toBe(true);
  });
});
