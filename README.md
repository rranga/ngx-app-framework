# ngx-app-framework

A native-first Angular application framework and reusable UI component library built with **Angular, Nx, TypeScript, and CSS design tokens**.

The goal is to provide reusable, accessible, themeable UI components and shared application-development capabilities for enterprise Angular applications.

> **Development status:** Phases 01–05 are complete, including the Tier-1 form controls (Input, Textarea, Select, Checkbox, Radio Group). Visual regression workflows, broader component coverage, full CI/CD, and package publishing remain future work.
>
> **Live Storybook:** https://rranga.github.io/ngx-app-framework/

## Project Goals

- Build reusable Angular UI components using native HTML, CSS, and Angular.
- Establish consistent design tokens and light/dark theme support.
- Follow standalone Angular component patterns and modern Angular APIs.
- Support accessibility, keyboard navigation, and semantic HTML.
- Provide component documentation and interactive examples through Storybook.
- Establish automated unit, end-to-end, and visual regression testing.
- Organize shared code and applications in an Nx integrated monorepo.
- Prepare reusable libraries for package distribution.

## Technology Stack

| Technology                   | Purpose                                      |
| ---------------------------- | -------------------------------------------- |
| Angular                      | Application and component framework          |
| Nx                           | Monorepo management and task orchestration   |
| TypeScript                   | Type-safe development                        |
| CSS / SCSS                   | Styling, design tokens, and component styles |
| npm                          | Dependency and package management            |
| ESLint                       | Code quality                                 |
| Vitest-based Angular testing | Unit testing                                 |
| Playwright                   | Browser-based end-to-end testing             |
| Storybook                    | Interactive component documentation          |

Storybook 10 is configured in the `docs-storybook` Angular app. The Welcome story, design-token color preview, dark-theme preview, and Shared Field example have been verified locally. Visual regression workflows and package publishing remain future work.

## Repository Structure

```text
ngx-app-framework/
├── apps/
│   ├── host/                         # Host application and integration testing
│   ├── docs-storybook/               # Storybook documentation application
│   └── docs-storybook-e2e/            # Playwright E2E project for docs
├── libs/
│   ├── design-tokens/                # Shared CSS design-token foundation
│   └── ui-components/                # Reusable Angular UI components
│       └── src/lib/field/            # Shared field and field-control directive
├── docs/                             # Technical and phase documentation
├── tools/                            # Development tooling
├── nx.json
├── package.json
├── package-lock.json
├── tsconfig.base.json
└── README.md
```

The structure will expand as additional applications, reusable libraries, and documentation tools are introduced.

## Getting Started

### Prerequisites

Install Node.js, npm, and Git. Use versions compatible with the repository's dependencies.

### 1. Clone the repository

```bash
git clone https://github.com/rranga/ngx-app-framework.git
cd ngx-app-framework
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Explore the Nx workspace

```bash
npx nx show projects
npx nx graph
```

The project list shows the applications and libraries configured in the local workspace. The project graph visualizes their relationships.

### 4. Run the Host application

```bash
npx nx serve host
```

Open the local URL printed by Nx, normally `http://localhost:4200/`.

The Host application currently provides a design-token smoke-test page with light and dark theme behavior.

### 5. Run Storybook

```bash
npx nx run docs-storybook:storybook
```

Open `http://localhost:4400/`. To create the static Storybook production build, run:

```bash
npx nx run docs-storybook:build-storybook
```

### 6. Published Storybook (GitHub Pages)

`.github/workflows/storybook.yml` publishes Storybook to **https://rranga.github.io/ngx-app-framework/**.

- On pull requests it runs lint, the `ui-components` unit tests and build, and the Storybook build, and reports the result as a PR check. Nothing is deployed.
- On pushes to `main` (or a manual run) it runs the same checks and, only if they pass, deploys Storybook to GitHub Pages.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. CI uses the Node version in `.nvmrc`.

This workflow only verifies and publishes the documentation site; the full CI/CD pipeline (Jenkins) is planned for Phase 11.

## Common Development Commands

Run commands from the repository root.

### Host application

```bash
npx nx serve host
npx nx build host
npx nx test host
npx nx lint host
```

### Design-token library

```bash
npx nx build design-tokens
```

### UI components library

```bash
npx nx build ui-components
npx nx test ui-components --skip-nx-cache
npx nx lint ui-components
```

### Storybook and E2E

```bash
npx nx run docs-storybook:storybook        # dev server (http://localhost:4400)
npx nx run docs-storybook:build-storybook  # Storybook production build
npx nx run docs-storybook:build            # docs Angular app build
npx nx e2e docs-storybook-e2e
```

### Host end-to-end testing

```bash
npx nx e2e host-e2e
```

Run a target only if it is configured for the relevant project in the current workspace.

## Design Tokens

The `design-tokens` library provides shared CSS custom properties for:

- Brand and semantic colors
- Backgrounds and surfaces
- Spacing
- Typography
- Border widths and radii
- Box shadows
- Z-index layering
- Light and dark themes
- Baseline styles for focus visibility and reduced motion

The current stylesheet entry point is:

```text
libs/design-tokens/src/lib/styles/index.css
```

The Host application and Storybook preview use the design-token styles from the workspace. A stable public CSS import path for external package consumers remains to be finalized.

See [Design Tokens — Phase 02](docs/design-tokens.md) for implementation details and examples.

## UI Components

The buildable Angular library is located at `libs/ui-components/`. Its package name is `@rranga/ngx-ui-components`. The library is designed to use native HTML, CSS/SCSS, Angular, and the workspace's design tokens rather than relying on a third-party visual component library.

### Form controls

| Component | Selector | Purpose |
| --- | --- | --- |
| `Field` | `ngx-field` | Label, required indicator, hint and error for one control. |
| `FieldControl` | `[ngxFieldControl]` | Connects a projected *native* control to its field's ARIA state. |
| `Input` | `ngx-input` | Text, email, password, number, tel, url and search input. |
| `Textarea` | `ngx-textarea` | Multi-line text with a resize policy. |
| `Select` | `ngx-select` | Native single-value select with typed options. |
| `Checkbox` | `ngx-checkbox` | Boolean choice with an indeterminate state. |
| `RadioGroup` / `Radio` | `ngx-radio-group` / `ngx-radio` | Labelled group of native radios. |
| `FormControlAccessor` | `ngx-*[formControlName]`, `[formControl]`, `[ngModel]` | Connects the controls to Reactive and template-driven forms. |

```typescript
import { Component, signal } from '@angular/core';
import { Field, Input } from '@rranga/ngx-ui-components';

@Component({
  selector: 'app-profile',
  imports: [Field, Input],
  template: `
    <ngx-field id="email" label="Email address" hint="Use your work email." [error]="emailError()" required>
      <ngx-input type="email" autocomplete="email" [(value)]="email" />
    </ngx-field>
  `,
})
export class Profile {
  readonly email = signal('');
  readonly emailError = signal('');
}
```

Inside `ngx-field`, library controls inherit the id, `aria-describedby`, error state and `required` automatically. Native elements use `ngxFieldControl`. The controls use native constraint validation and expose a `validity()` signal with error keys (the application owns message text). They work with Angular Signal Forms (`[formField]`), and with Reactive Forms and `ngModel` when you import `FormControlAccessor`.

See **[Form Controls — Phase 05](docs/form-controls.md)** for the full API, validation behaviour (including the telephone and number policies), forms integration and the accessibility contract.

### Storybook examples

Stories live in `apps/docs-storybook/src/app/*.stories.ts` under **Design System → Forms**: Field, Input (types, states, validation), Textarea, Select, Checkbox, Radio Group, plus Signal Forms and Reactive Forms integration forms.

## Documentation

- [Workspace Foundation — Phase 01](docs/workspace-foundation.md)
- [Design Tokens — Phase 02](docs/design-tokens.md)
- [Form Controls — Phase 05](docs/form-controls.md)

Phase 03 to Phase 05 implementation details are summarized below. Additional phase-specific documentation can be added as the framework grows.

## Development Principles

- **Native-first UI:** Prefer native HTML and CSS rather than depending on a third-party visual component library.
- **Accessibility:** Use semantic markup, keyboard support, visible focus indicators, and accessible interaction patterns.
- **Reusability:** Keep shared UI and application capabilities in dedicated libraries.
- **Consistency:** Use shared design tokens rather than duplicating styling values.
- **Quality:** Validate changes with builds, linting, unit tests, and appropriate browser tests.
- **Incremental delivery:** Implement, verify, document, and commit each phase separately.

## Phase 03 — Storybook Setup

The dedicated documentation app and its E2E project are in place:

- `apps/docs-storybook/` — Angular application hosting Storybook documentation.
- `apps/docs-storybook-e2e/` — Playwright E2E project for the documentation app.
- `@nx/storybook@23.2.1` — Nx Storybook plugin aligned with the workspace's Nx version.

**Implemented and verified locally:**

- Storybook starts with `npx nx run docs-storybook:storybook` on `http://localhost:4400/`.
- `Getting Started/Welcome` renders successfully.
- `Design System/Design Tokens` previews five color tokens from the shared CSS custom properties.
- `Design System/Themes` previews the dark theme using `[data-ngx-theme="dark"]`.
- `npx nx build design-tokens` completed successfully.
- The Storybook production build completed successfully.

The Storybook preview loads the existing CSS from `libs/design-tokens/src/lib/styles/` through `apps/docs-storybook/src/styles.scss`. The Host app remains separate from the documentation app. Package publishing and visual regression testing have not yet been verified.

## Phase 04 — Shared Field and UI Components

**Implemented and verified locally:**

- Created the buildable `@rranga/ngx-ui-components` library under `libs/ui-components/`.
- Added the standalone `ngx-field` component with label, required indicator, hint, error, and computed description IDs.
- Added and exported the standalone `FieldControl` directive using the `[ngxFieldControl]` selector.
- Added unit tests for field rendering and projected-control accessibility behavior.
- Added a Storybook example at `Design System/Field/Examples` (moved to `Design System/Forms/Field` in Phase 05).
- Verified that the field example renders and the email error can be toggled interactively.
- Verified the UI library tests, production build, lint, and Storybook production build.

The UI library test suite currently contains 11 passing tests across three test files. These checks validate the initial foundation, not every possible browser, assistive-technology, or form-integration scenario. Further controls, accessibility testing, and documentation remain planned.

## Phase 05 — Tier-1 Form Controls

**Status:** complete. Reviewed and merged in pull request #1.

**Implemented:**

- `Input` completed with typed constraint inputs (`minLength`, `maxLength`, `min`, `max`, `step`, `pattern`, `inputMode`, `name`), a `validity()` signal, `touched`/`touch`, and `focus()`.
- New `Textarea`, `Select`, `Checkbox`, and `RadioGroup`/`Radio` components with the same contract.
- `NGX_FIELD_CONTEXT`, an explicit, tested integration contract between `ngx-field` and controls.
- Structural compatibility with Angular Signal Forms (`[formField]`), covered by an integration test.
- `FormControlAccessor` for Reactive Forms (`formControlName`, `[formControl]`) and template-driven forms (`ngModel`). It mirrors disabled, required, touched and submitted state from the `FormControl`, and is scoped by selector so it never competes with Signal Forms. `@angular/forms` is now a peer dependency.
- Separate stories for every control, all using the `ngx-docs-` story selector prefix.

**Fixes to earlier work:**

- `ngx-field id="…"` duplicated the id on the host element, so `<label for>` resolved to the host instead of the control. Hosts no longer carry the id.
- `FieldControl` now uses signal-based `host` bindings instead of `@HostBinding` getters plus a `markForCheck` effect.
- Story selectors now satisfy the docs app's `ngx-docs` prefix lint rule.

**Verified:** 121 unit tests across 11 files; `ui-components` build and lint; `docs-storybook` lint, app build and Storybook production build; all 10 Forms stories rendered in Chromium in light and dark themes with no console errors; browser checks of validation, label association, Signal Forms and Reactive Forms submit/reset/disable, and radio-group keyboard navigation.

## Troubleshooting

### `Vitest failed to find the runner`

If every spec fails with this error, check for an `NX_WORKSPACE_ROOT_PATH` environment variable whose drive-letter case differs from the real path (for example `e:\…` instead of `E:\…`). Some editor integrations set it. Nx then loads Vitest from `e:/…` while Vite resolves imports to `E:/…`, creating two Vitest instances. Unset it for the session:

```bash
# Git Bash
env -u NX_WORKSPACE_ROOT_PATH npx nx test ui-components --skip-nx-cache
```

```powershell
# PowerShell
Remove-Item Env:NX_WORKSPACE_ROOT_PATH; npx nx test ui-components --skip-nx-cache
```

## Planned Development

The roadmap includes:

1. Workspace foundation.
2. Design-token foundation.
3. Storybook setup and documentation.
4. Native UI component library and foundational form controls.
5. Additional component tiers and accessibility testing.
6. Application Development Kit (ADK).
7. Composed examples and showcase applications.
8. CI, package publishing, and release workflows.
9. Developer documentation and contribution guidance.

The roadmap describes intended work, not a claim that all these capabilities are already implemented.

## Contributing

During development, keep documentation aligned with the code, run the relevant validation commands, and use descriptive commit messages.

Examples:

```text
feat(design-tokens): add core design token foundation
feat(ui-components): add shared field and accessibility directive
docs(workspace): document foundation and design tokens
```

## License

Add the project's chosen license before distributing the framework publicly as an open-source package.
