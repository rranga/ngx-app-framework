# @rranga/ngx-ui-components

Native-first, accessible Angular UI components styled with `@rranga/ngx-design-tokens`.

## Components

- `Field` (`ngx-field`) and `FieldControl` (`[ngxFieldControl]`)
- `Input` (`ngx-input`), `Textarea` (`ngx-textarea`), `Select` (`ngx-select`)
- `Checkbox` (`ngx-checkbox`), `RadioGroup` (`ngx-radio-group`) and `Radio` (`ngx-radio`)
- `FormControlAccessor`: opt-in Reactive Forms / `ngModel` support (Signal Forms works without it)

All components are standalone, `OnPush` and signal-based, and wrap native form elements. See [docs/form-controls.md](../../docs/form-controls.md) for APIs, validation and accessibility.

## Development

```bash
npx nx test ui-components --skip-nx-cache
npx nx lint ui-components
npx nx build ui-components
```
