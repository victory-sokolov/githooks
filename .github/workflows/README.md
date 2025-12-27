# Reusable Node.js CI Workflows

This repository contains reusable GitHub Actions workflows for Node.js projects that support both **bun** and **pnpm** package managers.

## 🚀 Quick Start

### Using the Reusable Workflow

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

## 📋 What This CI Runs

The reusable workflow automatically runs the following steps:

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

Your project should have these scripts in `package.json`:

### For pnpm projects:
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

### For bun projects:
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

## 📁 Artifacts

The workflow uploads two types of artifacts:

1. **Coverage Reports**: Available in the Actions tab under "coverage-report-{package-manager}"
2. **Build Artifacts**: Available in the Actions tab under "build-artifacts-{package-manager}"

## 🔄 Workflow Triggers

The workflow runs on:
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches
- Manual workflow dispatch

## 📄 License

This workflow is part of the githooks repository. Check the main repository for license information.

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve these reusable workflows!
