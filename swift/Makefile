# Makefile Swift Project
# Provides commands for linting, formatting, and code quality checks
APP_NAME := ""
DESTINATION ?= 'platform=iOS Simulator,name=iPhone 15 Pro,OS=latest'

.PHONY: help lint lint-fix format format-check concurrency-check analyze check clean test pre-commit

# Linting targets
lint: ## Run SwiftLint to check for style violations 
	@echo "🔍 Running SwiftLint..."
	swiftlint --strict

lint-fix: ## Run SwiftLint with auto-fix for style violations
	@echo "🔧 Running SwiftLint with auto-fix..."
	swiftlint --fix

# Formatting targets
format: ## Format Swift code using SwiftFormat
	@echo "📝 Formatting Swift code..."
	swiftformat --config .swiftformat .

format-check: ## Check Swift code formatting without modifying files
	@echo "🔍 Checking Swift code formatting..."
	swiftformat --dryrun --config .swiftformat .

jscpd: ## Run jscpd to detect code duplication
	@echo "🔍 Running jscpd for code duplication detection..."
	npx jscpd $(APP_NAME)/Sources $(APP_NAME)/Tests --config .jscpd.json

# Code quality checks
concurrency-check: ## Check for Swift 6 concurrency issues
	@echo "🔒 Checking for Swift 6 concurrency issues..."
	./scripts/check-concurrency.sh

analyze: ## Run Xcode Static Analyzer with concurrency checks
	@echo "🔬 Running Xcode Static Analyzer..."
	./scripts/run-analyzer.sh

# Testing target
test: ## Run tests using Swift Testing framework
	@echo "🧪 Running tests..."
	xcodebuild -workspace $(APP_NAME).xcworkspace -scheme $(APP_NAME) -destination $(DESTINATION) test 2>&1 | xcbeautify

# Pre-commit target
pre-commit: ## Run pre-commit hooks on all files
	@echo "🔗 Running pre-commit hooks..."
	pre-commit run --all-files
	@echo "✅ Code formatted and linting checked"

check: format-check lint ## Check formatting and linting (no modifications)
	@echo "✅ Formatting and linting checks passed"

# Clean target
clean: ## Remove build artifacts
	@echo "🧹 Cleaning build artifacts..."
	xcodebuild clean -workspace $(APP_NAME).xcworkspace -scheme $(APP_NAME)


.DEFAULT_GOAL := help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sort \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
