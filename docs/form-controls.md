# Form Controls — Phase 05

Tier-1 form controls in `@rranga/ngx-ui-components`: `Input`, `Textarea`, `Select`, `Checkbox` and `RadioGroup`/`Radio`, together with the `Field` wrapper from Phase 04.

Every control is a standalone, `OnPush`, signal-based component that wraps a **native** form element. That keeps browser behaviour (keyboard, autofill, mobile keyboards, constraint validation, screen-reader semantics) instead of re-implementing it.

- [Import](#import)
- [Shared contract](#shared-contract)
- [Field integration](#field-integration)
- [Validation](#validation)
- [Angular Signal Forms](#angular-signal-forms)
- [Reactive and template-driven forms](#reactive-and-template-driven-forms)
- [Component APIs](#component-apis)
- [Accessibility](#accessibility)
- [Known limitations](#known-limitations)

## Import

Import only the components a template uses. The package is side-effect free (`"sideEffects": false`), so unused components are tree-shaken.

```typescript
import { Field, Input, Select, Checkbox, RadioGroup, Radio, Textarea } from '@rranga/ngx-ui-components';
```

The package declares `@angular/core` and `@angular/forms` as peer dependencies. Only `FormControlAccessor` uses `@angular/forms` at runtime; the controls themselves do not import it.

Styles come from `@rranga/ngx-design-tokens`; load its global stylesheet once in the application (see [Design Tokens](design-tokens.md)).

## Shared contract

All controls follow the same conventions so they are predictable and interchangeable.

| Member | Kind | Purpose |
| --- | --- | --- |
| `value` / `checked` | `model()` | Two-way state: `[(value)]`, or `[(checked)]` for checkbox. |
| `touched` | `model<boolean>()` | Becomes `true` when the control loses focus. |
| `touch` | `output<void>()` | Emits on every blur. |
| `validity` | `Signal<ControlValidity>` | Native constraint-validation state (read-only). |
| `disabled`, `required`, `invalid` | `input<boolean>()` | Accept bound values or bare attributes (`<ngx-input required />`). |
| `describedBy` | `input<string \| null>()` | Extra ids for `aria-describedby`. |
| `id` | `input<string>()` | Optional. Defaults to the enclosing field's id, then a generated id. |
| `focus()` | method | Moves focus to the native element. |

Values are never silently rewritten. `Input`, `Textarea` and `Select` values are always `string`, including `type="number"`, because that is what the browser reports. Parse values where you consume them.

## Field integration

`ngx-field` provides the `NGX_FIELD_CONTEXT` token. `Input`, `Textarea` and `Select` inject it, so inside a field you don't repeat ids or ARIA wiring:

```html
<ngx-field id="email" label="Email address" hint="Use your work email." [error]="emailError()" required>
  <ngx-input type="email" autocomplete="email" [(value)]="email" />
</ngx-field>
```

The control automatically:

- uses `id="email"`, so `<label for="email">` targets it;
- sets `aria-describedby` to the field's hint and error ids (merged with its own `describedBy`, without duplicates);
- sets `aria-invalid="true"` while the field shows an error, and removes it when the error clears;
- inherits `required`.

Native elements opt in with the `ngxFieldControl` directive. Give the element the field's id:

```html
<ngx-field id="dob" label="Date of birth">
  <input id="dob" type="date" ngxFieldControl />
</ngx-field>
```

Custom controls can join the same contract by injecting `NGX_FIELD_CONTEXT` (`id`, `describedBy`, `invalid`, `required` signals).

`Checkbox` and `RadioGroup` aren't placed in `ngx-field`. A checkbox is labelled by its own content, and a radio group is labelled by a `<legend>`, which `RadioGroup` renders together with its own `hint` and `error`.

## Validation

The library relies on **native constraint validation** (`required`, `type`, `pattern`, `minLength`, `maxLength`, `min`, `max`, `step`). It doesn't ship its own email or URL parsers.

### Reading validity

`validity()` returns an immutable snapshot:

```typescript
interface ControlValidity {
  readonly valid: boolean;
  readonly errors: readonly ValidityErrorKey[]; // most actionable first
}
```

Error keys mirror the browser's `ValidityState`: `badInput`, `valueMissing`, `typeMismatch`, `patternMismatch`, `tooShort`, `tooLong`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `customError`. Validity updates as the user types and whenever a constraint input changes.

### Messages are owned by the application

The library reports **keys, not text**, so wording and localisation stay in the application:

```typescript
readonly emailInput = viewChild.required<Input>('emailInput');
readonly emailTouched = signal(false);

readonly emailError = computed(() => {
  if (!this.emailTouched()) return '';
  const [first] = this.emailInput().validity().errors;
  return first === 'valueMissing' ? 'Enter your email.'
       : first === 'typeMismatch' ? 'Enter an email like name@example.com.'
       : '';
});
```

```html
<ngx-field id="email" label="Email" required [error]="emailError()">
  <ngx-input #emailInput type="email" [(touched)]="emailTouched" />
</ngx-field>
```

### When errors are presented

| Source | Presented as `aria-invalid` and error styling |
| --- | --- |
| `ngx-field` / `ngx-radio-group` `error` text | Immediately. The application decided to show the message. |
| A control's own `invalid` input | Once the control is `touched`. Pristine fields aren't announced as errors. |

Typical timing is "after blur, or after submit": gate the error text on `touched()` or a `submitted` flag. Angular Signal Forms marks every field touched on submit. To present a control's own `invalid` state immediately, also set `[touched]="true"`.

### Telephone policy

`type="tel"` doesn't restrict characters, and the component never strips input. Define the policy you need with `pattern` and `inputMode`. Example (optional leading `+`, then 7–15 digits):

```html
<ngx-input type="tel" inputMode="tel" autocomplete="tel" pattern="\+?[0-9]{7,15}" />
```

International formats vary (spaces, extensions, trunk prefixes), so adapt the pattern to your audience rather than relying on a global rule.

### Number policy

```html
<ngx-input type="number" inputMode="numeric" min="1" max="50" step="1" [(value)]="seats" />
```

- The model stays a `string` (`''` when empty). Convert with `Number(seats())` where needed.
- Empty is valid unless `required`. Out-of-range values report `rangeUnderflow` or `rangeOverflow`, and `2.5` with `step="1"` reports `stepMismatch`.
- Partially typed, unparseable text (for example `1e`) is left in the field and reported as `badInput`. The component never overwrites it.

## Angular Signal Forms

The controls structurally implement Angular's `FormValueControl` (`Input`, `Textarea`, `Select`, `RadioGroup`) and `FormCheckboxControl` (`Checkbox`) contracts, so they work with `[formField]` directly. The library has no runtime dependency on `@angular/forms`.

```typescript
readonly model = signal({ email: '', terms: false });
readonly signup = form(this.model, (path) => {
  required(path.email);
  email(path.email);
});
```

```html
<ngx-field id="email" label="Email" [error]="signup.email().touched() ? (signup.email().errors()[0]?.message ?? '') : ''">
  <ngx-input type="email" [formField]="signup.email" />
</ngx-field>
<ngx-checkbox [formField]="signup.terms">Accept terms</ngx-checkbox>
```

Signal Forms binds `value`/`checked`, `required`, `disabled`, `readonly`, `invalid`, `touched`, `name`, `minLength` and `maxLength`, and listens to `touch`. Pattern validators (`RegExp[]`) are validated by Signal Forms itself and are not rendered as a native `pattern` attribute.

## Reactive and template-driven forms

Import `FormControlAccessor` next to the controls to use `formControlName`, `[formControl]` or `ngModel`:

```typescript
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Field, FormControlAccessor, Input, Checkbox } from '@rranga/ngx-ui-components';

@Component({
  imports: [ReactiveFormsModule, FormControlAccessor, Field, Input, Checkbox],
  template: `
    <form [formGroup]="profile" (ngSubmit)="save()">
      <ngx-field id="email" label="Email" required [error]="emailError()">
        <ngx-input type="email" formControlName="email" />
      </ngx-field>
      <ngx-checkbox formControlName="terms">Accept terms</ngx-checkbox>
    </form>
  `,
})
export class Profile {
  readonly profile = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    terms: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });
}
```

Without the accessor, Angular reports `No value accessor for form control`. It applies to `ngx-input`, `ngx-textarea`, `ngx-select`, `ngx-checkbox` and `ngx-radio-group`.

| Form control state | Effect on the component |
| --- | --- |
| Value (`setValue`, `patchValue`, `reset`) | Written to the native element. Programmatic writes don't mark the control dirty. `null` becomes `''` (or `false` / no selection). |
| User input | Reported as a change (marks the control dirty); blur marks it touched. |
| `disable()` / `enable()` | Disables the native element (the `<fieldset>` for radio groups). |
| `Validators.required` / `requiredTrue` | Sets native `required` / `aria-required` and the required indicator on `ngx-radio-group`. |
| `invalid` + (`touched` or form submitted) | Presents `aria-invalid` and error styling. `reset()` / `resetForm()` clear it. |

State updates come from `control.events`, so they work with `OnPush` and zoneless change detection, including `markAllAsTouched()`.

Error **text** is still yours to render: pass a message to `ngx-field`'s `error` (or `ngx-radio-group`'s `error`), typically when `control.invalid && (control.touched || form.submitted)`. Because `ngx-field` cannot see the `FormControl`, set its `required` input yourself to show the asterisk.

**Template-driven forms** work the same way:

```html
<form>
  <ngx-input name="nickname" ariaLabel="Nickname" required [(ngModel)]="nickname" />
  <ngx-checkbox name="terms" required [(ngModel)]="terms">Accept terms</ngx-checkbox>
</form>
```

A `required` checkbox must be checked to be valid. Angular's built-in `RequiredValidator` would accept `false`, so the accessor adds the `requiredTrue` rule.

**Notes**

- Values are strings for `Input`, `Textarea` and `Select`, including `type="number"`. Use `FormControl<string>` and convert where you consume the value. Angular's native number accessor is not involved.
- Native constraint errors such as `typeMismatch` aren't reported to the `FormControl`. Use Angular validators (`Validators.email`, `Validators.min`, …) for form validity, as with native inputs.
- Signal Forms and Reactive Forms are independent. `FormControlAccessor` only activates alongside `formControlName`, `[formControl]` or `ngModel`, so it never competes with `[formField]`.

## Component APIs

### `Input` — `ngx-input`

| Input | Type | Default |
| --- | --- | --- |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` |
| `name`, `placeholder` | `string` | `''` |
| `autocomplete` | `string \| null` | `null` |
| `inputMode` | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url' \| null` | `null` |
| `readonly` | `boolean` | `false` |
| `minLength`, `maxLength` | `number \| undefined` | — |
| `min`, `max`, `step` | `string \| number \| undefined` | — |
| `pattern` | `string \| undefined` (implicitly anchored) | — |
| `ariaLabel`, `ariaLabelledBy` | `string \| null` — accessible name without a visible label | `null` |

Plus the [shared contract](#shared-contract).

### `Textarea` — `ngx-textarea`

`name`, `placeholder`, `rows` (default `3`), `resize` (`'vertical' | 'horizontal' | 'both' | 'none'`, default `'vertical'`), `autocomplete`, `readonly`, `minLength`, `maxLength`, `ariaLabel`, `ariaLabelledBy`, plus the shared contract.

### `Select` — `ngx-select`

Single selection only. Multi-select is planned as a Tier-2 composite.

```typescript
interface SelectOption { readonly value: string; readonly label: string; readonly disabled?: boolean; }
```

| Input | Notes |
| --- | --- |
| `options` | `readonly SelectOption[]` |
| `placeholder` | Renders an empty first option (`value=''`). With `required`, this reports `valueMissing` until a real option is chosen. Without a placeholder the browser shows the first option, so initialise `value` to match it. |
| `name`, `autocomplete`, `ariaLabel`, `ariaLabelledBy` | Native attributes. |

Native keyboard behaviour, type-ahead and mobile pickers are preserved.

### `Checkbox` — `ngx-checkbox`

```html
<ngx-checkbox required [(checked)]="accepted">I accept the terms</ngx-checkbox>
```

`checked` (boolean model), `indeterminate` (model; cleared by the browser when the user toggles), `name`, `required`, `disabled`, `invalid`, `describedBy`, `ariaLabel`. There is no string `value`, so checked state is always a boolean.

### `RadioGroup` — `ngx-radio-group`, `Radio` — `ngx-radio`

```html
<ngx-radio-group label="Plan" hint="Change any time." required [error]="planError()" [(value)]="plan">
  <ngx-radio value="free">Free</ngx-radio>
  <ngx-radio value="pro">Pro</ngx-radio>
  <ngx-radio value="legacy" disabled>Legacy</ngx-radio>
</ngx-radio-group>
```

| `RadioGroup` input | Notes |
| --- | --- |
| `label` (required) | Rendered as the `<legend>`. |
| `hint`, `error` | Rendered below the options and referenced by `aria-describedby`. |
| `value` | `model<string \| null>`; `null` when nothing is selected. |
| `name` | Shared native `name`; defaults to the group id. |
| `orientation` | `'vertical' \| 'horizontal'` |
| `required`, `disabled`, `invalid`, `describedBy`, `id` | |

`Radio` inputs: `value` (required, unique within the group), `disabled`, `id`.

## Accessibility

- **Labels:** inside `ngx-field`, `<label for>` resolves to the native control. Component hosts never carry the `id`, so ids stay unique. Standalone controls accept `ariaLabel`/`ariaLabelledBy`. Checkbox and radio labels are the projected content.
- **Descriptions:** `aria-describedby` only references elements that are rendered. Hint and error ids are added and removed with their elements.
- **Errors:** field and group errors use `role="alert"`, so they're announced when they appear. `aria-invalid` is present only while an error is presented (see [When errors are presented](#when-errors-are-presented)) and is never left behind as `aria-invalid="false"`.
- **Groups:** `RadioGroup` renders `<fieldset role="radiogroup">` labelled by its `<legend>`, with `aria-required` and `aria-invalid` on the group. The shared `name` gives native single selection, one tab stop for the group, and arrow-key navigation that skips disabled options.
- **Focus:** native focus is kept on the interactive element, with a visible `:focus-visible` outline using `--ngx-color-focus-ring`.
- **Motion and theming:** transitions respect `prefers-reduced-motion`. All colours, spacing, radii and type come from design tokens, so light and dark themes need no component overrides.
- **Lint:** `libs/ui-components` enforces Angular's template accessibility rule set.

Keyboard and focus behaviour was checked in Chromium against the Storybook build. Screen-reader passes (NVDA/VoiceOver) are still recommended before release.

## Known limitations

- With Reactive Forms, `FormControlAccessor` must be imported explicitly. It is a separate directive so it can't interfere with Signal Forms.
- `ngx-field` doesn't read `FormControl` state; pass its `error` and `required` inputs from your form logic.
- `Select` is single-value with flat options. Option groups and multi-select aren't supported.
- Library-level validation messages are intentionally not provided. Applications map `ValidityErrorKey`s to text.
- Generated ids are sequential per page load. Pass explicit ids when server-rendering pages whose component creation order can differ between server and client.
