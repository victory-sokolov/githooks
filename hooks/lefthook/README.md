# Lefthook Configuration

[Lefthook](https://github.com/evilmartians/lefthook) is a fast and powerful Git hooks manager for any type of project. It's written in Go and supports parallel execution of hooks.

## Usage

Create a `lefthook.yml` in your project root that references this remote configuration:

```yaml
remote:
  git: https://github.com/victory-sokolov/githooks
  config: hooks/lefthook/lefthook.yml
```

Then install the hooks:

```bash
lefthook install
```

## Available Pre-commit Commands

This configuration runs the following checks in parallel before each commit:

| Command | Description | Required Script |
|---------|-------------|-----------------|
| `format-check` | Checks code formatting | `bun run format:check` |
| `lint` | Runs the linter | `bun run lint` |
| `typecheck` | Runs TypeScript type checking | `bun run typecheck` |

## Prerequisites

Your project must have these npm scripts defined in `package.json`:

```json
{
  "scripts": {
    "format:check": "biome check .",
    "lint": "biome lint .",
    "typecheck": "tsc --noEmit"
  }
}
```

## Customization

You can extend or override the remote configuration by adding commands to your local `lefthook.yml`:

```yaml
remote:
  git: https://github.com/YOUR_ORG/githooks
  config: hooks/lefthook/lefthook.yml

pre-commit:
  commands:
    # Add custom commands
    test:
      run: bun test
```

For more information, see the [Lefthook documentation](https://github.com/evilmartians/lefthook/blob/master/docs/full_guide.md).
