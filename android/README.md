# Android/Kotlin CI Configuration

This directory contains comprehensive CI/CD configuration for Android/Kotlin projects, including:

- **ktlint** - Kotlin linter and formatter
- **detekt** - Static code analysis for Kotlin
- **jscpd** - Code duplication detection
- **GitHub Actions** workflow for automated CI
- **Pre-commit hooks** for local quality checks

## Quick Start

### 1. Copy Configuration Files

Copy the relevant files to your Android project root:

```bash
# Copy CI configuration
cp .github/workflows/android.yml /path/to/your/project/.github/workflows/

# Copy pre-commit config
cp .pre-commit-config.yaml /path/to/your/project/

# Copy tool configurations
cp .ktlint.toml /path/to/your/project/
cp detekt.yml /path/to/your/project/
cp .jscpd.json /path/to/your/project/
cp Makefile /path/to/your/project/
```

### 2. Update build.gradle.kts

Add the following plugins to your `build.gradle.kts` (or `build.gradle`):

```kotlin
plugins {
    id("com.android.application") version "8.x.x"
    id("org.jetbrains.kotlin.android") version "2.x.x"
    id("org.jlleitschuh.gradle.ktlint") version "12.x.x"
    id("io.gitlab.arturbosch.detekt") version "1.x.x"
}
```

Or for Groovy DSL:

```groovy
plugins {
    id 'com.android.application' version '8.x.x'
    id 'org.jetbrains.kotlin.android' version '2.x.x'
    id 'org.jlleitschuh.gradle.ktlint' version '12.x.x'
    id 'io.gitlab.arturbosch.detekt' version '1.x.x'
}
```

### 3. Configure Plugins in build.gradle.kts

```kotlin
ktlint {
    version.set("1.3.1")
    debug.set(false)
    verbose.set(true)
    android.set(true)
    outputToConsole.set(true)
    outputColorName.set("RED")
    ignoreFailures.set(false)
    enableExperimentalRules.set(false)
}

detekt {
    buildUponDefaultConfig = true
    allRules = false
    config = files("${rootDir}/detekt.yml")
    baseline = file("${rootDir}/config/detekt/baseline.xml")
    reportsDir = file("${rootDir}/build/reports/detekt")
}
```

### 4. Install Pre-commit Hooks

```bash
pip install pre-commit
pre-commit install
```

## Local Development Commands

Using the provided Makefile:

```bash
# Show all available commands
make help

# Linting and formatting
make lint              # Run ktlint and detekt
make lint-fix           # Auto-fix issues with ktlint
make format             # Format code (alias for lint-fix)
make format-check        # Check formatting without modifying

# Static analysis
make detekt            # Run detekt only
make ktlint-check       # Run ktlint check only

# Building
make build              # Build the project
make assemble-debug      # Build debug APK
make assemble-release     # Build release APK

# Testing
make test               # Run unit tests
make test-debug         # Run debug unit tests
make test-connected      # Run connected tests on device/emulator
make coverage            # Generate code coverage report

# Pre-commit
make pre-commit         # Run all pre-commit hooks
make check              # Run all quality checks

# Cleanup
make clean              # Remove build artifacts
make clean-build-cache  # Clean Gradle build cache
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/android.yml`) runs:

| Job | Description |
|-----|-------------|
| **ktlint** | Checks code style and formatting |
| **detekt** | Static analysis for code quality |
| **build** | Compiles the Android project |
| **unit_tests** | Runs unit tests and publishes results |
| **lint** | Runs Android Lint for platform-specific issues |

### Workflow Inputs

You can customize the CI by passing inputs:

```yaml
- uses: ./.github/workflows/android.yml
  with:
    runner: 'ubuntu-latest'       # Runner to use
    java_version: '21'              # Java version
    run_lint: true                    # Run lint step
    run_build: true                   # Run build step
    run_unit_tests: true               # Run unit tests
    run_detekt: true                   # Run detekt
    gradle_tasks: 'assembleDebug testDebugUnitTest lintDebug'
```

## Configuration Files

### .ktlint.toml

Configures ktlint for Kotlin code style and formatting. Key settings:

- `indent_size = 2` - 2 spaces for indentation
- `continuation_indent_size = 4` - 4 spaces for continuation
- `max_line_length = 140` - Maximum line length

### detekt.yml

Configures detekt for static analysis. Includes:

- **Complexity** rules - Method/class size, nesting depth
- **Coroutines** rules - Proper coroutine usage
- **Potential-bugs** rules - Common bug patterns
- **Style** rules - Code style conventions
- **Performance** rules - Performance optimizations

### .jscpd.json

Configures jscpd for code duplication detection:

- `threshold: 100` - Minimum tokens to consider as duplication
- Checks `*.kt`, `*.kts`, `*.gradle` files
- Excludes build and generated directories

## IDE Integration

### Android Studio / IntelliJ IDEA

1. Install the **ktlint** plugin
2. Enable **detekt** plugin (optional)
3. Configure to use project configuration files

### VS Code

Install extensions:
- **Kotlin Language** (fwcd.kotlin)
- **detekt** (mathiasfrodetektdetekt)

## Gradle Tasks Reference

```bash
# ktlint tasks
./gradlew ktlintCheck           # Check for style violations
./gradlew ktlintFormat          # Format code
./gradlew ktlintFormatCheck      # Check formatting

# detekt tasks
./gradlew detekt                 # Run detekt analysis
./gradlew detektBaseline          # Generate baseline

# Build tasks
./gradlew assembleDebug          # Build debug APK
./gradlew assembleRelease         # Build release APK
./gradlew bundleRelease           # Build release AAB

# Test tasks
./gradlew testDebugUnitTest       # Run unit tests
./gradlew connectedDebugAndroidTest  # Run instrumented tests
./gradlew lintDebug              # Run Android Lint
```

## Troubleshooting

### ktlint issues

```bash
# Auto-fix most issues
./gradlew ktlintFormat

# Check which files have issues
./gradlew ktlintCheck --verbose
```

### detekt issues

```bash
# Generate baseline to ignore existing issues
./gradlew detektBaseline

# Run with detailed output
./gradlew detekt --info
```

### Pre-commit issues

```bash
# Run on all files to identify issues
pre-commit run --all-files

# Skip hooks (not recommended)
git commit --no-verify -m "message"
```

## Additional Resources

- [ktlint Documentation](https://pinterest.github.io/ktlint/)
- [detekt Documentation](https://detekt.dev/)
- [jscpd Documentation](https://jscpd.app/)
- [Android Gradle Plugin](https://developer.android.com/build)
