# Reusable GitHub Actions Workflows

This repository contains reusable GitHub Actions workflows for various automation tasks including Node.js CI and Dependabot PR management.

## 📋 Available Workflows

### 1. **Node.js CI Workflow** - For Node.js projects with bun/pnpm support
### 2. **Auto-merge Dependabot PR Workflow** - For automated Dependabot PR management
### 3. **Swift CI Workflow** - For Swift projects with linting, building, and testing

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