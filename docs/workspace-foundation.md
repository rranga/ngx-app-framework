# Phase 01 — Workspace Foundation

## 1. Overview

The workspace foundation establishes the development environment and monorepo structure for **`ngx-app-framework`**, a reusable Angular application framework and native UI component library.

The project uses Nx to organize applications, libraries, tooling, and shared functionality in a single repository. This foundation is intended to support independent application development, reusable packages, automated testing, documentation, and future package publishing.

### Goals

- Establish an Nx integrated monorepo.
- Create a working Angular Host application.
- Configure the initial development, build, lint, and testing workflows.
- Establish Git-based source control.
- Prepare the repository for shared libraries and future Storybook documentation.
- Maintain a foundation that can grow as additional applications and libraries are introduced.

## 2. Technology Stack

The initial workspace was generated with the following technology stack.

| Technology                            | Purpose                                    |
| ------------------------------------- | ------------------------------------------ |
| Nx                                    | Monorepo management and task orchestration |
| Angular                               | Application and component development      |
| TypeScript                            | Application development with type checking |
| npm                                   | Dependency and package management          |
| ESLint                                | Static analysis and code quality           |
| Angular build tooling / Vite          | Application build and development serving  |
| Angular unit-test tooling with Vitest | Unit testing                               |
| Playwright                            | End-to-end browser testing                 |
| Git and GitHub                        | Version control and repository hosting     |

**Version note:** The local environment reported Nx 23.2.1, Angular 22.1.x, Node.js 24.15.0, and npm 11.12.1 during initial development. Check the current installed versions before using this document as a release compatibility statement.

## 3. Initial Workspace Structure

The workspace is designed to organize application entry points separately from reusable libraries.

```text
ngx-app-framework/
├── apps/
│   └── host/
├── libs/
│   └── design-tokens/
├── docs/
├── tools/
├── nx.json
├── package.json
├── package-lock.json
├── tsconfig.base.json
└── README.md
```

The structure above shows the main areas relevant to the initial foundation. Additional applications and libraries will be introduced in later phases.

### Key directories and files

- `apps/host/` — Angular application used to validate shared framework capabilities during development.
- `libs/` — Reusable libraries shared across applications.
- `docs/` — Technical documentation, architecture decisions, and phase-specific implementation notes.
- `tools/` — Reserved for custom development and build tooling.
- `nx.json` — Nx workspace configuration.
- `package.json` — Project scripts and dependency declarations.
- `package-lock.json` — Reproducible npm dependency resolution.
- `tsconfig.base.json` — Shared TypeScript configuration.

## 4. Host Application

The Host application provides a runnable Angular application for validating framework integration.

It currently serves as a development and smoke-test environment for shared styles and future UI components.

Responsibilities include:

- Loading shared global styles.
- Validating design-token integration.
- Providing a place to test light and dark theme behavior.
- Serving as an integration point for future reusable components.

The Host is a development application, not the publishable UI component library itself.

## 5. Development Environment

### Prerequisites

Install the following before working with the repository:

- Node.js version compatible with the project's dependencies.
- npm.
- Git.
- A code editor such as Visual Studio Code.

Use the repository's committed lockfile when installing dependencies.

### Install dependencies

From the repository root:

```powershell
npm ci
```

### Inspect Nx projects

```powershell
npx nx show projects
```

### Start the Host application

```powershell
npx nx serve host
```

The development server normally makes the application available at:

```text
http://localhost:4200/
```

Use the URL reported by the terminal if the port differs.

## 6. Build, Test, and Lint

The initial workspace includes the following validation commands.

### Host application

```powershell
npx nx build host
npx nx test host
npx nx lint host
```

### End-to-end tests

The generated workspace also includes a Host E2E project. Inspect the project list to confirm its exact name, then run its test target. For example:

```powershell
npx nx e2e host-e2e
```

Use the target and project name shown by Nx if the generated configuration differs.

### Design-token library

The design-token library was added during Phase 02. Its build command is:

```powershell
npx nx build design-tokens
```

## 7. Source Control

The project is maintained in Git and hosted on GitHub.

Repository:

https://github.com/rranga/ngx-app-framework

Commit messages follow a conventional format:

```text
type(scope): concise description
```

Examples:

```text
chore(workspace): initialize Nx Angular workspace
feat(design-tokens): add core design token foundation
docs(workspace): document workspace foundation
```

Review `git status` before staging or committing files. Include the workspace configuration and lockfile whenever they are required by the change.

## 8. Initial Validation

The generated Host application was successfully built and its initial lint and test workflows were verified.

During Phase 02, the Host application was updated to demonstrate design-token usage. Its original starter test was updated to reflect the new page.

The current validation status should be confirmed by running the commands in Section 6 before a release or major integration change.

## 9. Architectural Principles

The workspace foundation supports these project principles:

- **Monorepo organization:** Keep related applications, libraries, and tooling in one repository.
- **Reusable libraries:** Separate shared capabilities from application-specific code.
- **Incremental delivery:** Implement, validate, document, and commit work phase by phase.
- **Quality gates:** Use builds, linting, unit tests, and E2E tests to catch regressions.
- **Native-first UI:** Build the component system around native HTML, CSS, and Angular rather than relying on a third-party visual component library.
- **Documentation alongside implementation:** Keep the repository documentation aligned with the actual code.

## 10. Phase 01 Completion Criteria

- [x] Nx integrated workspace initialized.
- [x] Angular Host application generated.
- [x] GitHub repository established.
- [x] Initial build, lint, and test workflows exercised.
- [x] Workspace prepared for reusable libraries.
- [x] Phase-specific documentation created.

## 11. Next Phase

Phase 02 introduced the shared design-token foundation. See [Design Tokens](./design-tokens.md) for token categories, theme behavior, integration, and validation details.
