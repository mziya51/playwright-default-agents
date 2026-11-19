# Playwright Test Automation with AI Agents

An end-to-end test automation project built with Playwright and TypeScript, integrating Playwright's test planner, test generator, and test healer agents.

The framework combines human-readable test planning, executable browser tests, and agent-assisted failure investigation. Its current configuration runs tests against Chromium, Firefox, and WebKit and generates HTML reports.

## Overview

- TypeScript-based Playwright tests.
- Three browser projects: Chromium, Firefox, and WebKit.
- Parallel test execution locally and a single worker in CI.
- Two retries in CI and no retries locally.
- HTML reporting and trace collection on the first retry.
- Agent definitions for planning, generating, and healing tests.
- GitHub Actions workflow files and a VS Code MCP configuration file.

> This README reflects the supplied configuration and repository structure. Package versions, workflow triggers, MCP server settings, and test implementation details should be verified in their respective files.

## Technology Stack

| Component | Purpose |
| --- | --- |
| Playwright Test | Browser automation, assertions, test execution, and reporting |
| TypeScript | Test and configuration code |
| Node.js and npm | JavaScript runtime and dependency management |
| Playwright Test Agents | Agent-assisted planning, generation, and repair |
| VS Code / compatible agent environment | Interface for invoking configured agents and tools |
| MCP | Tool connectivity configured through `.vscode/mcp.json` |
| GitHub Actions | Repository workflow automation |

Dependency versions are defined in `package.json` and resolved in `package-lock.json`; they are not inferred here.

## Project Structure

```text
playwright-default-agents/
├── .github/
│   ├── agents/
│   │   ├── playwright-test-generator.agent.md
│   │   ├── playwright-test-healer.agent.md
│   │   └── playwright-test-planner.agent.md
│   └── workflows/
│       ├── copilot-setup-steps.yml
│       └── playwright.yml
├── .vscode/
│   └── mcp.json
├── node_modules/
├── playwright-report/
├── specs/
├── test-results/
├── tests/
│   ├── login_successful_happy_path.spec.ts
│   └── login_test_plan.md
├── .gitignore
├── package-lock.json
├── package.json
└── playwright.config.ts
```

### Directory Responsibilities

| Path | Role |
| --- | --- |
| `.github/agents/` | Instructions and tool definitions for the three agents |
| `.github/workflows/` | GitHub Actions workflow definitions; inspect the YAML files for actual behavior |
| `.vscode/mcp.json` | MCP server configuration for the development environment |
| `specs/` | Conventional location for human-readable test plans |
| `tests/` | Test discovery root configured by `testDir` |
| `tests/login_test_plan.md` | Existing login test plan; Markdown is not executed as a Playwright test |
| `tests/login_successful_happy_path.spec.ts` | Existing login test file; inspect it for its exact steps and assertions |
| `playwright-report/` | Generated HTML report output |
| `test-results/` | Generated test artifacts, including traces when collected |
| `node_modules/` | Locally installed dependencies |
| `playwright.config.ts` | Browser projects and execution settings |

The current login plan is under `tests/`, although `specs/` also exists. Either location can be referenced explicitly in agent prompts. If plans are moved into `specs/`, update references in prompts and generated tests accordingly.

## Prerequisites

- A Node.js version supported by the Playwright version installed in this repository.
- npm.
- Access to the application under test and any required test accounts.
- Playwright browser binaries and required operating system dependencies.
- For agent workflows: an agent-capable editor or client, the required authentication/subscription where applicable, and access to the configured MCP tools.

Check your environment:

```bash
node --version
npm --version
```

After installing project dependencies, check Playwright:

```bash
npx playwright --version
```

Standard test execution does not require invoking the AI agents.

## Installation

From the repository root:

```bash
npm ci
npx playwright install
```

On supported systems that need browser system dependencies, use:

```bash
npx playwright install --with-deps
```

`npm ci` uses the committed lockfile and requires it to match `package.json`.

## Configuration

The active settings in `playwright.config.ts` are:

| Setting | Local execution | CI execution (`CI` is truthy) |
| --- | --- | --- |
| Test directory | `./tests` | `./tests` |
| Fully parallel | Enabled | Enabled, but limited by one worker |
| Worker count | Playwright default | `1` |
| Retries | `0` | `2` |
| Reject `test.only` | No | Yes |
| Reporter | HTML | HTML |
| Trace collection | First retry, if a retry occurs | First retry |

The CI check uses JavaScript truthiness: a non-empty value such as the string `"false"` still enables the CI branch.

### Browser Projects

| Project | Device preset |
| --- | --- |
| `chromium` | `Desktop Chrome` |
| `firefox` | `Desktop Firefox` |
| `webkit` | `Desktop Safari` |

These are Playwright browser projects with desktop presets. The Chromium project does not explicitly select installed Google Chrome, and the WebKit project does not mean the installed Safari application is being launched.

Mobile, Microsoft Edge, and branded Google Chrome projects are present only as commented examples and are not active.

### Application URL and Environment Variables

The following configuration blocks are currently commented out:

- `dotenv` imports and `.env` loading.
- `use.baseURL`.
- `webServer`.

Consequences:

- A `.env` file is not automatically loaded by the supplied configuration.
- The configuration does not provide a base URL for relative navigation.
- Playwright does not start a local application server through this configuration.

Ensure the application is running and that tests obtain the correct URL through their implementation. If you want relative navigation, configure a suitable base URL. For example:

```ts
use: {
  baseURL: process.env.BASE_URL,
  trace: 'on-first-retry',
},
```

This is an optional change, not an existing setting. Supply `BASE_URL` through your shell or CI environment, or explicitly configure environment-file loading.

## Running Tests

Run these commands from the repository root.

### Run All Configured Browsers

```bash
npx playwright test
```

### Run One Browser Project

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run the Existing Login Test

```bash
npx playwright test tests/login_successful_happy_path.spec.ts
```

To run it only in Chromium:

```bash
npx playwright test tests/login_successful_happy_path.spec.ts --project=chromium
```

### Run with a Visible Browser

```bash
npx playwright test --project=chromium --headed
```

### Open UI Mode

```bash
npx playwright test --ui
```

### List Discovered Tests

```bash
npx playwright test --list
```

Commands use the Playwright CLI directly because custom npm scripts have not been provided.

## AI Agent Workflow

```text
Application + Requirements
          ↓
     Test Planner
          ↓
   Markdown Test Plan
          ↓
    Test Generator
          ↓
 Playwright Test Files
          ↓
     Test Execution
          ↓
 Test Healer, if needed
          ↓
 Human Review + Re-run
```

Agents can be used independently or sequentially. Running `npx playwright test` executes tests; it does not automatically invoke the planner, generator, or healer.

### 1. Test Planner

Definition:

```text
.github/agents/playwright-test-planner.agent.md
```

The planner explores the application and produces a Markdown plan describing scenarios, actions, test data, and expected outcomes. Provide the application URL, scope, and any required setup. A seed test can supply fixtures, hooks, or authentication setup when needed; no seed test is shown in the current repository structure.

Example request to the planner agent:

> Explore the login flow for the application at <APPLICATION_URL>. Create a test plan covering successful login, invalid credentials, and required-field validation. Include prerequisites, test data requirements, and expected results. Save the plan to specs/login_test_plan.md. Do not include real credentials.

The existing `tests/login_test_plan.md` can also be reviewed or extended rather than creating a new plan.

### 2. Test Generator

Definition:

```text
.github/agents/playwright-test-generator.agent.md
```

The generator turns a Markdown plan into executable Playwright tests and checks interactions against the live application.

Example request:

> Read tests/login_test_plan.md and generate the successful-login scenario in tests/login_successful_happy_path.spec.ts. Verify locators against the application, use meaningful assertions, and obtain credentials from an approved configuration source rather than hardcoding them. Review the existing file before making changes.

Review generated code before accepting it, especially assertions, credentials, data cleanup, and browser assumptions.

### 3. Test Healer

Definition:

```text
.github/agents/playwright-test-healer.agent.md
```

The healer investigates failing tests, replays interactions, and attempts repairs. It may update locators or other test logic and re-run the affected test. A successful repair is not guaranteed; the agent may also mark a test skipped when it considers functionality broken.

Example request:

> Investigate the failing test in tests/login_successful_happy_path.spec.ts on Chromium. Reproduce the failure, inspect available artifacts, and propose a minimal fix. Preserve the intended assertions. Do not hide a product defect by removing assertions or skipping the test. Explain changes and re-run the affected test.

Treat changes and newly skipped tests as review items, not automatic proof of correctness.

### Agent and MCP Setup

Agent files already exist in this repository. Review them together with `.vscode/mcp.json` and enable the required tools in your editor before invoking an agent.

For a VS Code-based setup, Playwright provides this initialization command:

```bash
npx playwright init-agents --loop=vscode
```

Playwright recommends regenerating agent definitions after updating Playwright. Commit or back up local customizations first, then review the resulting diff.

## Reports and Traces

### HTML Report

Open the generated report:

```bash
npx playwright show-report
```

The report is generated under `playwright-report/` and provides results, errors, and available attachments.

### Trace Collection

The current setting is:

```ts
trace: 'on-first-retry'
```

Because local retries are disabled, a standard local run does not collect a trace through this setting. To collect one on the first retry locally:

```bash
npx playwright test --project=chromium --retries=1
```

The trace is collected only if a test fails and reaches that retry. Trace artifacts are stored under the relevant test output directory in `test-results/`.

## Continuous Integration

The repository contains:

```text
.github/workflows/playwright.yml
.github/workflows/copilot-setup-steps.yml
```

Inspect these files for actual triggers, permissions, setup commands, secrets, and uploaded artifacts. Their contents were not supplied, so this README does not assume a particular pipeline implementation.

A typical test job needs to:

1. Check out the repository.
2. Set up a compatible Node.js version.
3. Install dependencies with `npm ci`.
4. Install browsers and required system dependencies.
5. Provide application access and any required secrets.
6. Run `npx playwright test`.
7. Preserve reports and relevant artifacts for investigation.

When `CI` is set to a truthy value, the supplied Playwright configuration uses one worker, permits two retries, and rejects focused tests such as `test.only`.

## Adding a New Test

1. Create or update a Markdown plan, preferably under `specs/` for consistency.
2. Define prerequisites, test data, steps, and observable expected outcomes.
3. Generate or write a `.spec.ts` file under `tests/`.
4. Review locators and assertions against the actual application.
5. Keep tests isolated from each other and avoid shared mutable test data.
6. Run the test on a single browser while developing.
7. Run it across all configured browsers before merging.
8. Investigate failures and review any agent-generated modifications.

## Troubleshooting

| Issue | What to check |
| --- | --- |
| Browser executable is missing | Run `npx playwright install`; on supported systems, install required OS dependencies too |
| Relative navigation fails | `baseURL` is commented out; configure it or use the appropriate full URL |
| `.env` values are unavailable | `dotenv` loading is commented out; configure loading or inject environment variables |
| Application is not reachable | Application availability, URL, VPN/network access, and the inactive `webServer` block |
| No trace is produced locally | No retries are enabled by default and traces are collected only on the first retry |
| Tests behave differently in CI | Worker count, retries, environment variables, credentials, application availability, and `forbidOnly` |
| Agent tools are unavailable | Agent-capable editor/client, authentication, MCP settings, tool permissions, and agent definitions |
| Tests fail only in parallel | Shared accounts, data collisions, state dependencies, and cleanup |
| A Markdown plan does not execute | Plans are documentation; executable tests must use Playwright-supported test files |

## Security and Maintenance

- Never commit real credentials, tokens, or private session state.
- Supply secrets through approved local or CI configuration mechanisms supported by the test implementation.
- Review plans, reports, traces, screenshots, and agent conversations for sensitive information before sharing.
- Review agent-generated changes before committing them.
- Do not weaken assertions or silently skip tests to conceal application defects.
- Use isolated test accounts and avoid destructive actions against production environments.
- Keep generated dependencies and artifacts out of version control where appropriate; verify `.gitignore` rules for `node_modules/`, `playwright-report/`, and `test-results/`.
- After dependency updates, install matching browser binaries, refresh agent definitions as needed, and re-run the suite.
