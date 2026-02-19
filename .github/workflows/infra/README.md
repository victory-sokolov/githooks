# Infrastructure Workflows

Reusable GitHub Actions workflows for infrastructure-as-code projects.

## 📋 Available Workflows

| Workflow | Description |
|----------|-------------|
| [trivy-scan.yml](./trivy-scan.yml) | Security scanning for vulnerabilities, secrets, and misconfigurations |
| [security-scan.yml](./security-scan.yml) | Combined security scan (config + filesystem) |
| [terraform.yml](./terraform.yml) | Terraform quality checks with optional security scan |

---

## 🔒 Trivy Security Scan

Detects vulnerabilities, secrets, and misconfigurations in IaC files, container images, and filesystems.

### Configuration Options

| Input | Description | Default | Required |
|-------|-------------|---------|----------|
| `scan-type` | Trivy scan type: `fs`, `config`, `image` | `config` | No |
| `upload-sarif` | Upload SARIF to GitHub Security | `true` | No |
| `ignore-unfixed` | Ignore vulnerabilities with no fix | `true` | No |
| `format` | Output format: `table`, `json`, `sarif` | `sarif` | No |
| `artifact-retention` | Days to retain scan artifacts | `5` | No |

### Required Permissions

```yaml
permissions:
  contents: read
  security-events: write
  actions: read
```

### Usage Examples

#### Scan IaC Files (Kubernetes, Terraform, Docker)

```yaml
jobs:
  security:
    uses: victory-sokolov/githooks/.github/workflows/infra/trivy-scan.yml@main
    with:
      scan-type: 'config'
```

#### Scan Full Filesystem

```yaml
jobs:
  security:
    uses: victory-sokolov/githooks/.github/workflows/infra/trivy-scan.yml@main
    with:
      scan-type: 'fs'
```

#### Scan Container Images

```yaml
jobs:
  security:
    uses: victory-sokolov/githooks/.github/workflows/infra/trivy-scan.yml@main
    with:
      scan-type: 'image'
```

### What It Detects

- **Vulnerabilities (vuln)**: Known CVEs in dependencies and OS packages
- **Secrets (secret)**: Exposed API keys, tokens, passwords
- **Misconfigurations (misconfig)**: IaC security issues (Kubernetes, Terraform, Docker, etc.)

### Custom Configuration

The workflow uses `trivy.yaml` from the githooks repo by default. To override:

1. Add `trivy.yaml` to your repository root
2. The workflow will use your config instead

Example custom `trivy.yaml`:

```yaml
severity:
  - CRITICAL
  - HIGH
  - MEDIUM

skip-dirs:
  - node_modules
  - .terraform
  - vendor

vulnerability:
  ignore-unfixed: true
```

---

## 🔒 Security Scan (Combined)

Runs both config and filesystem scans in a single workflow.

### Usage

```yaml
name: Security

on:
  push:
    branches: [main, master]
  pull_request:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday

jobs:
  security:
    uses: victory-sokolov/githooks/.github/workflows/infra/security-scan.yml@main
```

### Triggers

The workflow runs automatically on:
- Push to `main` or `master`
- Pull requests
- Weekly schedule (Monday 00:00 UTC)
- Manual dispatch

---

## 🏗️ Terraform Quality Checks

Runs formatting, validation, planning, and optional security scanning.

### Configuration Options

| Input | Description | Default | Required |
|-------|-------------|---------|----------|
| `terraform_version` | Terraform version to use | `latest` | No |
| `working_directory` | Directory containing Terraform code | `.` | No |
| `skip_trivy` | Skip Trivy security scan | `false` | No |

### Required Permissions

```yaml
permissions:
  contents: read
  pull-requests: write
```

### Usage Examples

#### Basic Usage (includes Trivy scan)

```yaml
name: Terraform CI

on:
  push:
    branches: [main, master]
    paths:
      - '**/*.tf'
      - '**/*.tfvars'
  pull_request:
    paths:
      - '**/*.tf'

jobs:
  terraform:
    uses: victory-sokolov/githooks/.github/workflows/infra/terraform.yml@main
    with:
      working_directory: './infra/'
```

#### Skip Security Scan

```yaml
jobs:
  terraform:
    uses: victory-sokolov/githooks/.github/workflows/infra/terraform.yml@main
    with:
      working_directory: './infra/'
      skip_trivy: true
```

### What It Does

1. **terraform fmt**: Checks code formatting
2. **terraform validate**: Validates configuration syntax
3. **terraform plan**: Creates execution plan
4. **Trivy scan**: Scans for misconfigurations and secrets (optional)
