import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Field } from './field';

describe('Field', () => {
  let fixture: ComponentFixture<Field>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Field],
    }).compileComponents();

    fixture = TestBed.createComponent(Field);
    fixture.componentRef.setInput('id', 'email');
    fixture.componentRef.setInput('label', 'Email address');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the label associated with the control id', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.textContent).toContain('Email address');
    expect(label.htmlFor).toBe('email');
  });

  it('should render a required indicator when required', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const indicator: HTMLElement =
      fixture.nativeElement.querySelector('.ngx-field__required');

    expect(indicator).toBeTruthy();
    expect(indicator.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render hint text and expose its id', () => {
    fixture.componentRef.setInput('hint', 'Use your work email');
    fixture.detectChanges();

    const hint: HTMLElement =
      fixture.nativeElement.querySelector('.ngx-field__hint');

    expect(hint.textContent).toContain('Use your work email');
    expect(hint.id).toBe('email-hint');
  });

  it('should render the error message with an alert role', () => {
    fixture.componentRef.setInput('error', 'Enter a valid email');
    fixture.detectChanges();

    const error: HTMLElement =
      fixture.nativeElement.querySelector('.ngx-field__error');

    expect(error.textContent).toContain('Enter a valid email');
    expect(error.id).toBe('email-error');
    expect(error.getAttribute('role')).toBe('alert');
  });

  it('should compute describedBy from hint and error state', () => {
    fixture.componentRef.setInput('hint', 'Use your work email');
    fixture.componentRef.setInput('error', 'Enter a valid email');
    fixture.detectChanges();

    expect(fixture.componentInstance.describedBy()).toBe(
      'email-hint email-error',
    );
  });
});
