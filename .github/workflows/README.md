# Reusable GitHub Actions Workflows

This repository contains reusable GitHub Actions workflows for various automation tasks including Node.js CI, security scanning, and Dependabot PR management.

## 📋 Available Workflows

### CI/CD Workflows
1. **Node.js CI Workflow** - For Node.js projects with bun/pnpm support
2. **Swift CI Workflow** - For Swift projects with linting, building, and testing
3. **NPM Release Workflow** - For releasing packages to npm or GitHub Packages
4. **Dead Links Workflow** - For checking dead URLs and image links
5. **Drizzle ORM Workflow** - For database migrations and schema checks

### Security Workflows
5. **Trivy Security Scan** - Reusable workflow for vulnerability, secret, and misconfiguration scanning
6. **Security Scan** - Combined security scanning with SARIF upload to GitHub Security tab

### Infrastructure Workflows
7. **Terraform Quality Checks** - For Terraform projects with fmt, validate, and plan
8. **Auto-merge Dependabot PR Workflow** - For automated Dependabot PR management

## 🚀 Quick Start

### Node.js CI Workflow

Add this to your `.github/workflows/ci.yml` file:

```yaml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  ci:
    uses: victory-sokolov/githooks/.github/workflows/node-ci.yml@main
    with:
      package-manager: 'pnpm'  # or 'bun'
```

### Auto-merge Dependabot PR Workflow

Add this to your `.github/workflows/auto-merge-dependabot.yml` file:

```yaml
name: Auto-merge Dependabot PR

on:
  pull_request_target:
    types: [opened, synchronize]

jobs:
  auto-merge-dependabot:
    uses: victory-sokolov/githooks/.github/workflows/auto-merge-dependabot-pr.yml@main
    with:
      merge-strategy: 'squash'
      require-approval: true
      auto-merge-dev-deps: true
    secrets:
      github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 📋 Node.js CI Workflow Details

The Node.js CI workflow automatically runs the following steps:

### 1. **Environment Setup**
- Checks out your repository
- Reads Node.js version from `.nvmrc` (falls back to Node.js 24 if not found)
- Sets up the specified package manager (bun or pnpm)
- Installs dependencies with frozen lockfile

### 2. **Code Quality Checks**
- **Linting**: Runs `pnpm lint` or `bun run lint`
- **Format Checking**: Runs `pnpm format:check` (pnpm only)
- **Unused Code Detection**: Runs `pnpm knip` (pnpm only)
- **Type Checking**: Runs `pnpm typecheck` or `bun run typecheck`
- **Duplicate Code Detection**: Runs `bunx jscpd src/ lib/` (bun only)

### 3. **Testing**
- Runs tests with coverage: `pnpm test --coverage` or `bun test --coverage`
- Uploads coverage reports as GitHub artifacts

### 4. **Build**
- Builds your project: `pnpm build` or `bun run build`
- Uploads build artifacts (dist/, build/, .next/, out/)

### 5. **Security**
- Runs security audit: `pnpm audit --audit-level=moderate` or `bun pm audit --moderate`

## 🤖 Auto-merge Dependabot PR Workflow

Automatically approves and merges Dependabot PRs based on configurable criteria.

### 🔧 Configuration Options

| Input | Description | Default | Required |
|-------|-------------|---------|----------|
| `merge-strategy` | Merge strategy: `merge`, `squash`, or `rebase` | `merge` | No |
| `require-approval` | Whether to approve the PR before merging | `true` | No |
| `auto-merge-dev-deps` | Only auto-merge dev dependencies | `true` | No |
| `dependabot-actor` | GitHub actor to check for Dependabot | `dependabot[bot]` | No |
| `github-token` | GitHub token for PR operations | `${{ github.token }}` | No |

### 📋 Usage Examples

#### Basic Usage
```yaml
jobs:
  auto-merge-dependabot:
    uses: victory-sokolov/githooks/.github/workflows/auto-merge-dependabot-pr.yml@main
```

#### Advanced Configuration
```yaml
jobs:
  auto-merge-dependabot:
    uses: victory-sokolov/githooks/.github/workflows/auto-merge-dependabot-pr.yml@main
    with:
      merge-strategy: 'squash'
      require-approval: true
      auto-merge-dev-deps: false  # Merge all dependency updates
    secrets:
      github-token: ${{ secrets.GITHUB_TOKEN }}
```

#### Production Repository (More Restrictive)
```yaml
jobs:
  auto-merge-dependabot:
    uses: victory-sokolov/githooks/.github/workflows/auto-merge-dependabot-pr.yml@main
    with:
      merge-strategy: 'merge'
      require-approval: true
      auto-merge-dev-deps: true  # Only dev dependencies
```

### 🔒 Required Permissions

The workflow requires these permissions:
```yaml
permissions:
  contents: write
  pull-requests: write
```

### 🎯 How It Works

1. **Actor Check**: Verifies the PR was created by Dependabot
2. **Approval**: Optionally approves the PR (if `require-approval: true`)
3. **Filtering**: Optionally filters for dev dependencies only
4. **Auto-merge**: Enables auto-merge with specified strategy

### ⚠️ Important Notes

- The workflow uses `pull_request_target` event for proper token permissions
- Auto-merge must be enabled in repository settings
- The workflow will only merge if all required checks pass
- Consider using branch protection rules for additional safety

## 🏗️ Swift CI Workflow

The Swift CI workflow automatically runs linting, building, and testing for Swift projects.

### 🔧 Configuration Options

This workflow has no inputs; it runs on macOS with Swift 6.2.

### 📋 Usage Example

Add this to your `.github/workflows/swift-ci.yml` file:

```yaml
name: Swift CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  swift-ci:
    uses: victory-sokolov/githooks/.github/workflows/swift.yml@main
```

### 🎯 What It Does

1. **Linting**: Installs and runs SwiftLint for code style checks
2. **Formatting Check**: Installs and runs SwiftFormat to check code formatting
3. **Concurrency Checks**: Runs custom concurrency pattern checks
4. **Building**: Sets up Swift 6.2 and builds the project
5. **Testing**: Runs the test suite

### ⚠️ Requirements

- Your repository must contain Swift code (Package.swift or .swift files)
- macOS runners are used for compatibility with Swift tools

## 🚀 NPM Release Action

The NPM Release action handles semantic versioning and publishing private packages to npm or GitHub Packages.

### 🔧 Configuration Options

| Input | Description | Default | Required |
|-------|-------------|---------|----------|
| `package-manager` | Package manager: `bun`, `pnpm`, `npm`, or `yarn` | `bun` | No |
| `node-version` | Node.js version to use | `24` | No |
| `registry` | Registry: `npm` or `github` | `github` | No |
| `package-scope` | Package scope for GitHub registry (e.g., `@victory-sokolov`) | - | For GitHub |
| `skip-version-check` | Skip version check before publishing | `false` | No |

### 📋 Usage Examples

#### Release to npm Registry

```yaml
name: Release

on:
  workflow_run:
    workflows: ['CI']
    types:
      - completed
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
      packages: write
    steps:
      - uses: victory-sokolov/githooks/.github/actions/npm-release@main
        with:
          package-manager: npm
          registry: npm
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### Release to GitHub Packages

```yaml
name: Release

on:
  workflow_dispatch:

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
      packages: write
    steps:
      - uses: victory-sokolov/githooks/.github/actions/npm-release@main
        with:
          package-manager: bun
          node-version: '24'
          registry: github
          package-scope: '@victory-sokolov'
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 🎯 How It Works

1. **Setup**: Installs dependencies using the `node-deps-cache` action
2. **Build**: Runs build step
3. **Semantic Release**: Creates release with semantic-release
4. **Publish**: Publishes private packages to npm or GitHub Packages (skips if version already exists)

### 🔒 Required Permissions

For GitHub Packages:
```yaml
permissions:
  contents: write
  issues: write
  pull-requests: write
  packages: write
```

### ⚠️ Requirements

- `semantic-release` configured in your project
- For npm: `NPM_TOKEN` secret must be set
- For GitHub Packages: `package-scope` and `package-name` must be provided
- Your `package.json` must have the correct scope for GitHub Packages

## 📋 Drizzle ORM Workflow Details

The Drizzle ORM workflow runs database migrations, schema checks, and verification using drizzle-kit with a built-in PostgreSQL service.

### 🔧 Configuration Options

| Input | Description | Default | Required |
|-------|-------------|---------|----------|
| `database-url` | External PostgreSQL connection URL | - | No |
| `skip-check` | Skip `drizzle-kit check` step | `false` | No |
| `skip-push` | Skip `drizzle-kit push` step | `false` | No |
| `skip-migration` | Skip `drizzle-kit migrate` step | `false` | No |
| `skip-generate` | Skip `drizzle-kit generate --dry-run` step | `false` | No |
| `migration-table-name` | Custom migration table name | `__drizzle_migrations` | No |
| `working-directory` | Directory to run commands in | `.` | No |
| `bun-version` | Bun version to use | `1` | No |

### 📋 Usage Example

```yaml
name: Drizzle CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  drizzle:
    uses: victory-sokolov/githooks/.github/workflows/drizzle.yml@main
    with:
      working-directory: ./db
```

### 🎯 What It Does

1. **PostgreSQL Service**: Starts a PostgreSQL 16.4 container on port 5431
2. **Drizzle Kit Check**: Validates schema matches the database
3. **Drizzle Kit Push**: Syncs schema changes to the database
4. **Drizzle Kit Migrate**: Runs pending migrations
5. **Verify (dry-run)**: Runs `drizzle-kit generate --dry-run` to verify schema

### 🔒 Default Environment Variables

The workflow uses these default values (matching the postgres-service workflow):

- `PGHOST`: `localhost`
- `PGPORT`: `5431`
- `POSTGRES_DB`: `blog`
- `POSTGRES_USER`: `user`
- `POSTGRES_PASSWORD`: `securepassword`

### ⚠️ Requirements

- Drizzle Kit must be installed in your project (`drizzle-kit` as dependency or devDependency)
- Your `drizzle.config.ts` should be configured to read from `DATABASE_URL` environment variable

### Using External Database

To use an external PostgreSQL database instead of the built-in service:

```yaml
jobs:
  drizzle:
    uses: victory-sokolov/githooks/.github/workflows/drizzle.yml@main
    with:
      database-url: ${{ secrets.DATABASE_URL }}
      working-directory: ./db
```

### Skipping Specific Steps

```yaml
jobs:
  drizzle:
    uses: victory-sokolov/githooks/.github/workflows/drizzle.yml@main
    with:
      skip-check: true
      skip-push: true
      working-directory: ./db
```

## 📦 Package Manager Examples

### Using pnpm
```yaml
jobs:
  ci:
    uses: victory-sokolov/githooks/.github/workflows/node-ci.yml@main
    with:
      package-manager: 'pnpm'
```

### Using bun
```yaml
jobs:
  ci:
    uses: victory-sokolov/githooks/.github/workflows/node-ci.yml@main
    with:
      package-manager: 'bun'
```

## 🔧 Requirements

### For Node.js CI
Your project should have these scripts in `package.json`:

#### For pnpm projects:
```json
{
  "scripts": {
    "lint": "your-lint-command",
    "format:check": "your-format-check-command",
    "knip": "knip",
    "typecheck": "your-typecheck-command",
    "test": "your-test-command",
    "build": "your-build-command"
  }
}
```

#### For bun projects:
```json
{
  "scripts": {
    "lint": "your-lint-command",
    "typecheck": "your-typecheck-command",
    "test": "your-test-command",
    "build": "your-build-command"
  },
  "devDependencies": {
    "jscpd": "^3.x.x"
  }
}
```

### For Auto-merge Dependabot
- Repository must have auto-merge enabled in settings
- Dependabot must be configured for the repository
- Consider using branch protection rules

## 📁 Artifacts

The Node.js CI workflow uploads two types of artifacts:

1. **Coverage Reports**: Available in the Actions tab under "coverage-report-{package-manager}"
2. **Build Artifacts**: Available in the Actions tab under "build-artifacts-{package-manager}"

## 🔄 Workflow Triggers

### Node.js CI
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches
- Manual workflow dispatch

### Auto-merge Dependabot PR
- Pull request events from Dependabot
- Manual workflow dispatch (if configured)
