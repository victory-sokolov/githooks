# Makefile for Android/Kotlin Projects
# Provides commands for linting, formatting, building, and testing
MODULE := app
VARIANT ?= debug
KTLINT_VERSION ?= 1.3.1
KTLINT_URL ?= https://github.com/pinterest/ktlint/releases/download
KTLINT_CACHE ?= .ktlint-cache

.PHONY: help lint lint-fix format format-check detekt build test clean pre-commit check ktlint-download assemble assemble-test

# ktlint download and cache
ktlint-download: ## Download ktlint if not cached
	@echo "📥 Ensuring ktlint ${KTLINT_VERSION} is available..."
	@if [ ! -f "${KTLINT_CACHE}/ktlint" ]; then \
		echo "Downloading ktlint ${KTLINT_VERSION}...";\
		mkdir -p ${KTLINT_CACHE};\
		curl -sSLO ${KTLINT_URL}/${KTLINT_VERSION}/ktlint -o ${KTLINT_CACHE}/ktlint;\
		chmod +x ${KTLINT_CACHE}/ktlint;\
	fi
	@${KTLINT_CACHE}/ktlint --version

# Linting targets
lint: ktlint-download ## Run ktlint and detekt to check for code quality issues
	@echo "🔍 Running ktlint..."
	@${KTLINT_CACHE}/ktlint --reporter=plain --relative .
	@echo "🔍 Running detekt..."
	./gradlew detekt --no-daemon

detekt: ## Run detekt static analysis
	@echo "🔍 Running detekt static analysis..."
	./gradlew detekt --no-daemon

ktlint-check: ## Run ktlint to check for style violations
	@echo "🔍 Running ktlint check..."
	@${KTLINT_CACHE}/ktlint --reporter=plain --relative.

ktlint-format-check: ## Check Kotlin code formatting without modifying files
	@echo "🔍 Checking Kotlin code formatting..."
	@${KTLINT_CACHE}/ktlint --reporter=plain --relative --format.

# Auto-fix targets
lint-fix: ktlint-download ## Run ktlint with auto-fix for style violations
	@echo "🔧 Running ktlint with auto-fix..."
	@${KTLINT_CACHE}/ktlint --reporter=plain --relative --format --write-log=build/ktlint-log.txt .
	@if [ -s build/ktlint-log.txt ]; then\
		echo "ktlint made changes. Check build/ktlint-log.txt for details.";\
	fi

format: lint-fix ## Format Kotlin code using ktlint (alias for lint-fix)

format-check: ktlint-format-check ## Check formatting without modifying (alias for ktlint-format-check)

# Android Lint targets
android-lint: ## Run Android Lint
	@echo "🔍 Running Android Lint..."
	./gradlew lint$(shell echo $(VARIANT) | sed 's/.*/\U&/') --no-daemon

# Build targets
build: assemble ## Build the project (alias for assemble)

assemble: ktlint-download ## Build the APK for the specified variant (default: debug)
	@echo "🔨 Building $(MODULE) $(VARIANT) APK..."
	./gradlew assemble$(shell echo $(MODULE) | sed 's/^./\U/')$(shell echo $(VARIANT) | sed 's/.*/\U&/') --no-daemon

assemble-debug: ## Build the debug APK
	@echo "🔨 Building debug APK..."
	./gradlew assembleDebug --no-daemon

assemble-release: ## Build the release APK
	@echo "🔨 Building release APK..."
	./gradlew assembleRelease --no-daemon

# Testing targets
test: ## Run unit tests
	@echo "🧪 Running unit tests..."
	./gradlew test$(shell echo $(VARIANT) | sed 's/.*/\U&/')UnitTest --no-daemon

test-debug: ## Run debug unit tests
	@echo "🧪 Running debug unit tests..."
	./gradlew testDebugUnitTest --no-daemon

test-connected: ## Run connected tests on device/emulator
	@echo "🧪 Running connected tests..."
	./gradlew connected$(shell echo $(MODULE) | sed 's/^./\U/')$(shell echo $(VARIANT) | sed 's/.*/\U&/')AndroidTest --no-daemon

# Code coverage
coverage: ## Generate code coverage report for unit tests
	@echo "📊 Generating code coverage report..."
	./gradlew jacoco$(shell echo $(MODULE) | sed 's/^./\U/')$(shell echo $(VARIANT) | sed 's/.*/\U&/')TestReport --no-daemon

# jscpd for code duplication
jscpd: ## Run jscpd to detect code duplication
	@echo "🔍 Running jscpd for code duplication detection..."
	npx jscpd . --config .jscpd.json

# Pre-commit target
pre-commit: ## Run pre-commit hooks on all files
	@echo "🔗 Running pre-commit hooks..."
	pre-commit run --all-files
	@echo "✅ Code formatted and linting checked"

# Combined checks
check: format-check detekt jscpd ## Run all code quality checks
	@echo "✅ All code quality checks passed"

# Clean targets
clean: ## Remove build artifacts
	@echo "🧹 Cleaning build artifacts..."
	./gradlew clean --no-daemon

clean-ktlint-cache: ## Remove cached ktlint binary
	@echo "🧹 Cleaning ktlint cache..."
	rm -rf ${KTLINT_CACHE}

clean-build-cache: ## Clean Gradle build cache
	@echo "🧹 Cleaning Gradle build cache..."
	rm -rf ~/.gradle/caches

clean-all: clean clean-ktlint-cache clean-build-cache ## Clean everything (build artifacts, caches, ktlint)

# Gradle wrapper
gradle-wrapper: ## Re-generate Gradle wrapper files
	@echo "📦 Updating Gradle wrapper..."
	./gradlew wrapper --no-daemon

# Dependency updates
deps: ## Download and update dependencies
	@echo "📦 Updating dependencies..."
	./gradlew build --no-daemon

deps-tree: ## Show dependency tree
	@echo "🌲 Displaying dependency tree..."
	./gradlew :$(MODULE):dependencies --no-daemon

# Help target
.DEFAULT_GOAL := help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sort \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
