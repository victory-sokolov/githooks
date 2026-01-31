# Git Hooks
Git hooks collection

## Available Git Hooks

This repository contains various Git hooks that can be used to enforce development practices and automate tasks.

### Client-Side Hooks

#### `pre-commit`
- **Purpose**: Prevents accidental commits to protected branches and detects debug code.
- **Features**:
  - Blocks commits directly to the `master` branch
  - Scans for `!nocommit` comments in commit messages and aborts if found
- **Usage**: Copy to `.git/hooks/pre-commit` and make executable

#### `pre-push`
- **Purpose**: Prevents pushing to protected branches.
- **Features**:
  - Blocks pushes to `master` or `develop` branches
- **Usage**: Copy to `.git/hooks/pre-push` and make executable

### Server-Side Hooks

#### `post_merge_hook.sh`
- **Purpose**: Handles post-merge operations for specific project types.
- **Features**:
  - Warns about changes to `composer.lock` or `parameters.yml.dist`
  - Automatically runs `composer install` if lock files changed
  - Warns about new Doctrine migrations
- **Usage**: Copy to `.git/hooks/post-merge` and make executable

### Husky Hooks

#### `husky/post-merge`
- **Purpose**: Manages Node.js dependencies after merges.
- **Features**:
  - Detects changes to `package-lock.json` files (supports mono-repos)
  - Automatically runs `npm install` in affected directories
- **Usage**: Used with Husky for Git hooks management

## GitHub Actions Workflows

This repository provides reusable GitHub Actions workflows for common CI/CD tasks.

### Reusable Workflows

#### `node-ci.yml`
- **Purpose**: Comprehensive CI pipeline for Node.js projects
- **Features**:
  - Supports pnpm and bun package managers
  - Environment setup with Node.js version detection
  - Code quality checks (linting, formatting, type checking)
  - Testing with coverage reports
  - Build process with artifact uploads
  - Security auditing
- **Inputs**: `package-manager` (pnpm/bun)

#### `playwright-e2e.yml`
- **Purpose**: Run Playwright end-to-end tests
- **Features**:
  - Node.js environment setup
  - Automatic Playwright browser installation
  - Configurable test commands
  - Test report artifact upload
- **Inputs**: `node-version`, `playwright-version`, `test-command`, `working-directory`
- **Usage Example**:
  ```yaml
  jobs:
    e2e-tests:
      uses: your-org/githooks/.github/workflows/playwright-e2e.yml@main
      with:
        node-version: '20'
        test-command: 'npm run test:e2e'
        working-directory: './e2e'
  ```

#### `dependabot.yml` (Auto-merge Dependabot PR)
- **Purpose**: Automatically merges Dependabot pull requests
- **Features**:
  - Configurable merge strategies (merge, squash, rebase)
  - Optional PR approval
  - Filtering for dev dependencies only
- **Inputs**: `merge-strategy`, `require-approval`, `auto-merge-dev-deps`

#### `reusable-nextjs.yml`
- **Purpose**: Reusable workflow for building and exporting Next.js applications
- **Features**:
  - Sets up Node.js environment (defaults to latest LTS)
  - Supports npm, pnpm, and bun package managers
  - Installs dependencies with frozen lockfile
  - Builds the Next.js app
  - Runs tests (if available)
  - Exports the app for static deployment
  - Uploads build artifacts
- **Inputs**: `node-version` (optional, defaults to 'lts'), `working-directory` (optional, defaults to '.'), `package-manager` (optional, defaults to 'npm')
- **Usage Example**:
  ```yaml
  jobs:
    build:
      uses: your-org/githooks/.github/workflows/reusable-nextjs.yml@main
      with:
        node-version: '20'
        package-manager: 'pnpm'
        working-directory: './nextjs-app'
  ```

#### `swift.yml`
- **Purpose**: Swift code linting, building, and testing
- **Features**:
  - Installs SwiftLint and SwiftFormat
  - Runs linting with SwiftLint
  - Checks code formatting with SwiftFormat
  - Runs concurrency pattern checks
  - Builds Swift projects with `swift build`
  - Runs tests with `swift test`
- **Inputs**: None
- **Usage Example**:
  ```yaml
  jobs:
    swift-ci:
      uses: your-org/githooks/.github/workflows/swift.yml@main
  ```

### Example/Template Workflows

#### `code-review.yml`
- **Purpose**: Automated code review using ReviewDog
- **Trigger**: Manual dispatch

#### `codeql.yml`
- **Purpose**: Security analysis with GitHub CodeQL
- **Trigger**: Push/PR to main branch

#### `create-tag-from-version-txt.yml`
- **Purpose**: Creates Git tags from VERSION.txt file changes
- **Trigger**: Workflow dispatch or successful CI on master

#### `lighthouse.yml`
- **Purpose**: Performance testing with Lighthouse CI
- **Trigger**: PR events on main/master

#### `merge-schedule.yml`
- **Purpose**: Scheduled merging of pull requests
- **Trigger**: PR events (with optional cron schedule)

#### `npm-release.yml`
- **Purpose**: Automated NPM package releases
- **Trigger**: After successful CI workflow

#### `postgres-service.yml`
- **Purpose**: CI with PostgreSQL service
- **Trigger**: Manual dispatch (can be configured for push/PR)

#### `selenium.yml`
- **Purpose**: End-to-end testing with Selenium
- **Trigger**: Manual dispatch

#### `terraform.yml`
- **Purpose**: Terraform code quality checks
- **Trigger**: Push to non-main branches or workflow call

## GitHub Actions

### Composite Actions

#### `python-poetry.yml`
- **Purpose**: Sets up Python environment with Poetry
- **Features**:
  - Installs Python 3.12.5
  - Validates pyproject.toml
  - Installs Poetry
  - Caches virtual environment
  - Installs dependencies
- **Usage**: Call in workflow steps for Python projects using Poetry
