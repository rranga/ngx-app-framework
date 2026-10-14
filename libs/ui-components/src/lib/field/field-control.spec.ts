import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Field } from './field';
import { FieldControl } from './field-control';

@Component({
  standalone: true,
  imports: [Field, FieldControl],
  template: `
    <ngx-field
      id="email"
      label="Email address"
      hint="Use your work email"
      [error]="error()"
      [required]="true"
    >
      <input id="email" type="email" ngxFieldControl />
    </ngx-field>
  `,
})
class TestHost {
  readonly error = signal('Enter a valid email');
}

describe('FieldControl', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should apply hint and error IDs to aria-describedby', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.getAttribute('aria-describedby')).toBe(
      'email-hint email-error',
    );
  });

  it('should set aria-invalid when the field has an error', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should apply the required attribute', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.hasAttribute('required')).toBe(true);
  });

  it('should remove aria-invalid when the error is cleared', () => {
    fixture.componentInstance.error.set('');
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });
});
