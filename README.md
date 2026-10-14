# ngx-app-framework

A native-first Angular application framework and reusable UI component library built with **Angular, Nx, TypeScript, and CSS design tokens**.

The goal is to provide reusable, accessible, themeable UI components and shared application-development capabilities for enterprise Angular applications.

> **Development status:** Phases 01–04 have been implemented and verified locally. Phase 04 introduces the buildable `@rranga/ngx-ui-components` library, the shared `ngx-field` component, the `ngxFieldControl` accessibility directive, and a Storybook example. Visual regression workflows, broader component coverage, CI, and package publishing remain future work.

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

Open `http://localhost:4400/`. To build the Storybook application, run:

```bash
npx nx run docs-storybook:build
```

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
npx nx run docs-storybook:storybook
npx nx run docs-storybook:build
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

### Shared Field

The initial shared field component is exported as `Field`, with the selector `ngx-field`. It provides:

- A label associated with the supplied control ID.
- An optional required indicator.
- Optional hint text.
- Optional error text with `role="alert"`.
- A computed `describedBy` value containing the hint and error element IDs when present.
- `OnPush` change detection and Angular signal inputs.

The field is a layout and accessibility foundation. Individual controls remain responsible for their own values and form behavior.

### FieldControl directive

`FieldControl` is exported from the library and uses the `[ngxFieldControl]` attribute selector. Apply it to a projected control inside `ngx-field` to synchronize:

- `aria-describedby` with the field's hint and error IDs.
- `aria-invalid` with the field's error state.
- The native `required` attribute with the field's required state.

Example consumer usage:

```typescript
import { Component } from "@angular/core";
import { Field, FieldControl } from "@rranga/ngx-ui-components";

@Component({
  standalone: true,
  imports: [Field, FieldControl],
  template: `
    <ngx-field id="email" label="Email address" hint="Use your work email." [error]="emailError" [required]="true">
      <input id="email" type="email" ngxFieldControl />
    </ngx-field>
  `,
})
export class ExampleComponent {
  emailError = "";
}
```

Import both `Field` and `FieldControl` into the consumer component that declares the projected input. Use unique IDs for each control. For complex forms, ensure error state is driven by the form's validation logic.

### Storybook example

The Shared Field story is located at `apps/docs-storybook/src/app/field.stories.ts`.

In Storybook, open **Design System → Field → Examples** to preview the name and email fields and use the toggle button to show or clear the email error.

## Documentation

- [Workspace Foundation — Phase 01](docs/workspace-foundation.md)
- [Design Tokens — Phase 02](docs/design-tokens.md)

Phase 03 and Phase 04 implementation details are summarized below. Additional phase-specific documentation can be added as the framework grows.

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
- Added a Storybook example at `Design System/Field/Examples`.
- Verified that the field example renders and the email error can be toggled interactively.
- Verified the UI library tests, production build, lint, and Storybook production build.

The UI library test suite currently contains 11 passing tests across three test files. These checks validate the initial foundation, not every possible browser, assistive-technology, or form-integration scenario. Further controls, accessibility testing, and documentation remain planned.

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
