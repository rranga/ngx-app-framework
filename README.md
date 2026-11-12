# ngx-app-framework

A native-first Angular application framework and reusable UI component library built with **Angular, Nx, TypeScript, and CSS design tokens**.

The goal is to provide reusable, accessible, themeable UI components and shared application-development capabilities for enterprise Angular applications.

> **Development status:** Phases 01–05 are complete. The workspace, design tokens, Storybook documentation, the shared Field primitive and the Tier-1 form controls (Input, Textarea, Select, Checkbox, Radio Group) are implemented, tested and documented. Phase 06 (Tier-2 composite components) is next.
>
> **Live Storybook:** https://rranga.github.io/ngx-app-framework/

## Contents

- [Roadmap status](#roadmap-status)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Common development commands](#common-development-commands)
- [Storybook deployment and PR checks](#storybook-deployment-and-pr-checks)
- [Design tokens](#design-tokens)
- [UI components](#ui-components)
- [Documentation](#documentation)
- [Phase history](#phase-history)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Project Goals

- Build reusable Angular UI components using native HTML, CSS, and Angular.
- Establish consistent design tokens and light/dark theme support.
- Follow standalone Angular component patterns and modern Angular APIs (signals, `OnPush`, zoneless-ready).
- Support accessibility, keyboard navigation, and semantic HTML.
- Provide component documentation and interactive examples through Storybook.
- Establish automated unit, end-to-end, and visual regression testing.
- Organize shared code and applications in an Nx integrated monorepo.
- Prepare reusable libraries for package distribution.

## Roadmap Status

| Phase | Scope | Status |
| --- | --- | --- |
| 01 | Nx workspace foundation | Complete |
| 02 | Design tokens and theming | Complete |
| 03 | Storybook documentation | Complete |
| 04 | Shared Field primitive | Complete |
| 05 | Tier-1 form controls | Complete |
| 06 | Tier-2 composite components and utilities | Next |
| 07 | Tier-3 advanced widgets (table, chart, rich-text editor) | Planned |
| 08 | ngx-adk application kit (shell, auth, permissions, notifications) | Planned |
| 09 | Host/remotes architecture and component builder | Planned |
| 10 | E2E and visual regression testing | Planned |
| 11 | Jenkins CI/CD | Planned |
| 12 | Release documentation and clean-machine verification | Planned |

Planned phases describe intended work, not capabilities that already exist.

## Technology Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| Node.js / npm | 24.15.0 (`.nvmrc`) / 11.x | Runtime and package management |
| Angular | 22.1 | Application and component framework |
| Nx | 23.2.1 | Monorepo management and task orchestration |
| TypeScript | 6.0 | Type-safe development |
| CSS / SCSS | — | Design tokens and component styles |
| Vitest (via `@angular/build` unit-test) | 4.1 | Unit testing |
| Playwright | 1.63 | Browser end-to-end testing |
| Storybook | 10.6 | Interactive component documentation |
| ESLint + angular-eslint | 9.x | Code quality, including template accessibility rules |
| GitHub Actions + GitHub Pages | — | PR checks and published Storybook |

Versions are taken from `package-lock.json`; check it for exact versions.

## Repository Structure

```text
ngx-app-framework/
├── .github/workflows/
│   └── storybook.yml               # PR checks; deploys Storybook to GitHub Pages from main
├── .verdaccio/config.yml           # Local npm registry for package testing
├── apps/
│   ├── host/                       # Host application (design-token smoke test)
│   ├── host-e2e/                   # Playwright E2E project for host
│   ├── docs-storybook/             # Storybook documentation app (stories in src/app)
│   └── docs-storybook-e2e/         # Playwright E2E project for docs
├── libs/
│   ├── design-tokens/              # @rranga/ngx-design-tokens: CSS tokens and themes
│   └── ui-components/              # @rranga/ngx-ui-components
│       └── src/lib/
│           ├── field/              # ngx-field and the ngxFieldControl directive
│           ├── input/              # ngx-input
│           ├── textarea/           # ngx-textarea
│           ├── select/             # ngx-select
│           ├── checkbox/           # ngx-checkbox
│           ├── radio-group/        # ngx-radio-group and ngx-radio
│           └── forms/              # Shared form internals and FormControlAccessor
├── docs/                           # Phase documentation
├── .nvmrc                          # Node.js version used locally and in CI
├── nx.json
├── package.json
├── package-lock.json
├── project.json                    # Workspace-level targets (local registry)
├── tsconfig.base.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js 24.15.0** (see `.nvmrc`; with nvm run `nvm use`) and npm 11.
- Git.

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

The workspace contains six projects: `host`, `host-e2e`, `docs-storybook`, `docs-storybook-e2e`, `design-tokens` and `ui-components`.

### 4. Run Storybook

```bash
npx nx run docs-storybook:storybook
```

Open `http://localhost:4400/`. The published version is at https://rranga.github.io/ngx-app-framework/.

### 5. Run the Host application

```bash
npx nx serve host
```

Open the local URL printed by Nx, normally `http://localhost:4200/`. The Host application currently provides a design-token smoke-test page with light and dark theme behaviour.

## Common Development Commands

Run commands from the repository root.

### Quality gates (run before opening a pull request)

These are the same checks the GitHub workflow runs:

```bash
npx nx run-many -t lint -p ui-components docs-storybook
npx nx test ui-components --skip-nx-cache
npx nx build ui-components
npx nx run docs-storybook:build-storybook
```

### UI components library

```bash
npx nx build ui-components
npx nx test ui-components --skip-nx-cache
npx nx lint ui-components
```

### Design-token library

```bash
npx nx build design-tokens
npx nx test design-tokens
npx nx lint design-tokens
```

### Storybook

```bash
npx nx run docs-storybook:storybook        # dev server (http://localhost:4400)
npx nx run docs-storybook:build-storybook  # static production build -> dist/storybook/docs-storybook
npx nx run docs-storybook:build            # docs Angular app build (not Storybook)
```

### Host application

```bash
npx nx serve host
npx nx build host
npx nx test host
npx nx lint host
```

### End-to-end tests

```bash
npx playwright install    # first run only: download Playwright browsers
npx nx e2e host-e2e
npx nx e2e docs-storybook-e2e
```

### Local npm registry

```bash
npx nx run @ngx-app-framework/source:local-registry
```

Starts Verdaccio on `http://localhost:4873` (storage in `tmp/local-registry`) for trying package publishing locally. Packages are not published to npm yet.

## Storybook Deployment and PR Checks

`.github/workflows/storybook.yml` verifies the library and publishes Storybook:

| Trigger | What runs |
| --- | --- |
| Pull request to `main` | Lint, `ui-components` unit tests and build, Storybook build. Results appear as a PR check; nothing is deployed. |
| Push to `main` (or a manual run) | The same checks, then deployment to GitHub Pages only if they pass. |

- **Site:** https://rranga.github.io/ngx-app-framework/
- **One-time setup:** Settings → Pages → Build and deployment → Source: **GitHub Actions**.
- CI uses the Node.js version in `.nvmrc`. Workflow permissions are read-only, except the deploy job, which gets Pages rights.

This workflow only verifies and publishes the documentation site. The full CI/CD pipeline (Jenkins) is planned for Phase 11.

## Design Tokens

The `design-tokens` library (`@rranga/ngx-design-tokens`) provides shared CSS custom properties for:

- Brand and semantic colours
- Backgrounds and surfaces
- Spacing
- Typography
- Border widths and radii
- Box shadows
- Z-index layering
- Light and dark themes (dark theme via `[data-ngx-theme="dark"]`)
- Baseline styles for focus visibility and reduced motion

The current stylesheet entry point is:

```text
libs/design-tokens/src/lib/styles/index.css
```

The Host application and Storybook load these styles from the workspace. A stable public CSS import path for external package consumers is still to be finalised.

See [Design Tokens — Phase 02](docs/design-tokens.md) for details and examples.

## UI Components

The buildable Angular library lives in `libs/ui-components/`. Its package name is `@rranga/ngx-ui-components`, with peer dependencies `@angular/core` and `@angular/forms` (`^22.1.0`). Components use native HTML, SCSS and the workspace design tokens rather than a third-party visual component library.

All components are standalone, `OnPush` and signal-based (`input()`, `model()`, `output()`). The library's lint rules require `OnPush` and enforce Angular's template accessibility checks.

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

Key behaviour:

- **Field integration:** inside `ngx-field`, library controls inherit the id, `aria-describedby`, error state and `required` automatically. Native elements use `ngxFieldControl`.
- **Validation:** native constraint validation, exposed as a `validity()` signal of error keys. The application owns the message text.
- **Error presentation:** a field `error` shows immediately; a control's own invalid state shows once it is touched (or the form is submitted).
- **Forms:** Angular Signal Forms (`[formField]`) work directly. Reactive Forms and `ngModel` work when you import `FormControlAccessor`.
- **Values:** `Input`, `Textarea` and `Select` values are strings, including `type="number"`.

See **[Form Controls — Phase 05](docs/form-controls.md)** for the full API, validation policies (telephone and number), forms integration and the accessibility contract.

### Storybook stories

Stories live in `apps/docs-storybook/src/app/*.stories.ts`:

- **Getting Started:** Welcome
- **Design System:** Design Tokens, Themes
- **Design System → Forms:** Field, Input (types, states, validation), Textarea, Select, Checkbox, Radio Group, Signal Forms Integration, Reactive Forms Integration

Story-only components use the `ngx-docs-` selector prefix required by the docs app's lint rules.

## Documentation

- [Workspace Foundation — Phase 01](docs/workspace-foundation.md)
- [Design Tokens — Phase 02](docs/design-tokens.md)
- [Form Controls — Phase 05](docs/form-controls.md)

Phase 03 and Phase 04 are summarised under [Phase history](#phase-history). The phase documents describe the state at the end of each phase.

## Development Principles

- **Native-first UI:** Prefer native HTML and CSS rather than depending on a third-party visual component library.
- **Accessibility:** Use semantic markup, keyboard support, visible focus indicators, and accessible interaction patterns.
- **Reusability:** Keep shared UI and application capabilities in dedicated libraries.
- **Consistency:** Use shared design tokens rather than duplicating styling values.
- **Modern Angular:** Standalone components, signals, `OnPush`, and no reliance on Zone.js.
- **Quality:** Validate changes with builds, linting, unit tests, and appropriate browser tests.
- **Incremental delivery:** Implement, verify, document, and commit each phase separately.

## Phase History

### Phase 01 — Nx workspace foundation

Created the Nx Angular monorepo with the Host application, its Playwright E2E project, and shared lint, test and build configuration. See [Workspace Foundation](docs/workspace-foundation.md).

### Phase 02 — Design tokens and theming

Added `@rranga/ngx-design-tokens` with semantic colour, spacing, typography, radius, shadow and z-index tokens, plus light/dark themes, and integrated them into the Host smoke-test page. See [Design Tokens](docs/design-tokens.md).

### Phase 03 — Storybook setup

- Added `apps/docs-storybook/` (Angular app hosting Storybook) and `apps/docs-storybook-e2e/` (Playwright).
- Storybook loads the design-token CSS through `apps/docs-storybook/src/styles.scss`.
- Added the Welcome, Design Tokens and dark-theme stories, and verified the dev server and production build.
- Added the Verdaccio local registry target for future package testing.

### Phase 04 — Shared Field primitive

- Created the buildable `@rranga/ngx-ui-components` library.
- Added `ngx-field` (label, required indicator, hint, error, description ids) and the `ngxFieldControl` directive for projected native controls.
- Added unit tests and a Field story. At the end of Phase 04 the suite had 11 passing tests.

### Phase 05 — Tier-1 form controls

**Status:** complete; merged into `main` via pull request #1.

- Completed `Input` with typed constraint inputs (`minLength`, `maxLength`, `min`, `max`, `step`, `pattern`, `inputMode`, `name`), a `validity()` signal, `touched`/`touch` and `focus()`.
- Added `Textarea`, `Select`, `Checkbox` and `RadioGroup`/`Radio` with the same contract.
- Added `NGX_FIELD_CONTEXT`, an explicit, tested contract between `ngx-field` and controls.
- Added Angular Signal Forms compatibility and `FormControlAccessor` for Reactive Forms and `ngModel`. `@angular/forms` became a peer dependency.
- Added one story per control plus Signal Forms and Reactive Forms integration stories.
- **Fixes to earlier work:**
  - `ngx-field` no longer duplicates its id on the host element, which had broken `<label for>` association.
  - `FieldControl` now uses signal host bindings.
  - Story selectors now satisfy the `ngx-docs` prefix rule.
- **Verified:** 121 unit tests across 11 files, plus build and lint for both projects and the Storybook production build. All Forms stories were rendered in Chromium in light and dark themes, with browser checks of validation, labelling, forms integration and keyboard navigation.

After Phase 05, the GitHub workflow for PR checks and Storybook deployment to GitHub Pages was added.

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

### Playwright reports a missing browser executable

Run `npx playwright install` to download the browser versions that match the installed `@playwright/test`.

### Storybook deployment fails with a Pages error

Make sure **Settings → Pages → Source** is set to **GitHub Actions**, then re-run the workflow from the **Actions** tab.

## Contributing

1. Create a branch from `main` (for example `feat/phase-06-overlays`).
2. Keep documentation aligned with the code. Add or update unit tests and Storybook stories for user-visible components.
3. Run the [quality gates](#quality-gates-run-before-opening-a-pull-request) locally.
4. Use [Conventional Commits](https://www.conventionalcommits.org/) with a scope, one commit per component or concern, each building on its own. For example:

   ```text
   feat(ui-components): add select component
   fix(ui-components): keep field ids unique
   ci(storybook): verify and deploy Storybook to GitHub Pages
   docs(ui-components): document phase 05 form controls
   ```

5. Open a pull request to `main` and wait for the **Storybook** check to pass.
6. Merge with **Rebase and merge** to keep a linear history.

## License

The root `package.json` declares `MIT`, but the repository does not yet include a `LICENSE` file. Add one before distributing the framework publicly as an open-source package.
