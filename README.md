# ngx-app-framework

A native-first Angular application framework and reusable UI component library built with **Angular, Nx, TypeScript, and CSS design tokens**.

The goal is to provide reusable, accessible, themeable UI components and shared application-development capabilities for enterprise Angular applications.

> **Development status:** Workspace foundation and initial design-token foundation implemented. Storybook integration, the reusable component library, and application development kit are planned for subsequent phases.

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

Storybook, visual regression workflows, and package publishing are planned capabilities; their implementation status should be updated as those phases are completed.

## Repository Structure

```text
ngx-app-framework/
├── apps/
│   └── host/                 # Host application and integration testing
├── libs/
│   └── design-tokens/        # Shared CSS design-token foundation
├── docs/                     # Technical and phase documentation
├── tools/                    # Reserved for development tooling
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

The project list shows the actual applications and libraries configured in your local workspace. The project graph visualizes their relationships.

### 4. Run the Host application

```bash
npx nx serve host
```

Open the local URL printed by Nx, normally:

```text
http://localhost:4200/
```

The Host application currently provides a design-token smoke-test page with light and dark theme behavior.

## Common Development Commands

Run commands from the repository root.

### Host application

```bash
npx nx build host
npx nx test host
npx nx lint host
```

### Design-token library

```bash
npx nx build design-tokens
```

### End-to-end testing

Check the configured E2E project name with:

```bash
npx nx show projects
```

Then run its E2E target using the project name shown in the workspace.

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

The Host application currently imports this stylesheet through a local source-relative path. A stable public CSS import path for external package consumers remains to be finalized.

See [Design Tokens — Phase 02](docs/design-tokens.md) for implementation details and examples.

## Documentation

- [Workspace Foundation — Phase 01](docs/workspace-foundation.md)
- [Design Tokens — Phase 02](docs/design-tokens.md)
- [Implementation Roadmap](docs/implementation-roadmap.md) — include this link when the roadmap file exists.

## Development Principles

- **Native-first UI:** Prefer native HTML and CSS rather than depending on a third-party visual component library.
- **Accessibility:** Use semantic markup, keyboard support, visible focus indicators, and accessible interaction patterns.
- **Reusability:** Keep shared UI and application capabilities in dedicated libraries.
- **Consistency:** Use shared design tokens rather than duplicating styling values.
- **Quality:** Validate changes with builds, linting, unit tests, and appropriate browser tests.
- **Incremental delivery:** Implement, verify, document, and commit each phase separately.

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

Example:

```text
feat(design-tokens): add core design token foundation
docs(workspace): document foundation and design tokens
```

## License

Add the project's chosen license before distributing the framework publicly as an open-source package.
