# shopify-cli-theme-multipush

Push a compiled Shopify theme to multiple environments at once, using a wildcard pattern against a `shopify.theme.toml` config file. Wraps `shopify theme push` — sequential by default, with an optional concurrent mode, dry-run preview, retry-on-throttle, and a final error summary.

## Install

This is a Shopify CLI plugin — install it into your existing `shopify` CLI, not as a standalone package:

```bash
shopify plugins install shopify-cli-theme-multipush
```

Requires the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (`shopify`) installed and authenticated. Do not `npm install -g` this package — it would install its own separate `shopify` binary that collides with the real Shopify CLI.

### Update

```bash
shopify plugins update
```

### Uninstall

```bash
shopify plugins uninstall shopify-cli-theme-multipush
```

## Setup

Create a `shopify.theme.toml` in your project root, listing the environments to push to:

```toml
# shopify.theme.toml
path = "dist"  # optional global default path

[environments.production_eu]
path = "dist/eu"  # optional per-environment path override

[environments.production_us]

[environments.staging]
```

Environment names are matched against `--env` using `*` as a wildcard, e.g. `production_*` matches `production_eu` and `production_us`.

## Usage

```bash
shopify theme multipush --env <pattern> [flags]
```

### Flags

| Flag | Shorthand | Description | Default |
|---|---|---|---|
| `--env` | `-e` | Environment wildcard, matched against `[environments.*]` in `shopify.theme.toml` (required) | — |
| `--allow-live` | `-a` | Skip the confirmation prompt when pushing to a live theme | `false` |
| `--path` | — | Override the compiled theme directory for every matched environment | from toml |
| `--dry-run` | — | Print what would be pushed without pushing anything | `false` |
| `--async` | — | Push to all matched environments concurrently, with a progress bar per environment | `false` (sequential) |
| `--batch-size` | — | Max number of concurrent pushes when using `--async` | `10` |

`--path` and `--dry-run` are full-flag only (no shorthand), to avoid clashing with the `-p`/`-d` meanings (`publish`/`development`) from the base Shopify CLI theme command.

> **Note:** `multipush` is not a full wrapper of `shopify theme push` — it only supports the flags listed above. Other `theme push` flags (e.g. `--theme`, `--json`, `--nodelete`, `--only`, `--ignore`, `--live`, `--development`, `--unpublished`, `--publish`) are **not** implemented here and passing them will fail. Each matched environment is always pushed with `-e <env>` and, if set, `--path`/`--allow-live` — nothing else is forwarded.

## Examples

Push to every environment starting with `production_`, skipping the live-theme confirmation:

```bash
shopify theme multipush -e production_* -a
```

Push to a single named environment:

```bash
shopify theme multipush --env staging
```

Preview what would happen without pushing anything:

```bash
shopify theme multipush --env "production_*" --dry-run
```

Push to all matching environments concurrently, 5 at a time:

```bash
shopify theme multipush --env "production_*" --async --batch-size 5
```

Override the theme directory for this run, regardless of what's in the toml:

```bash
shopify theme multipush --env "production_*" --path ./dist/build-42
```

## Behavior notes

- Failed pushes are retried up to 3 times automatically when Shopify responds with a throttle error (30s wait between retries).
- At the end of a run, a summary lists any environments that failed, with the captured CLI output for each.
- In `--async` mode, output per environment is condensed into a live progress bar instead of raw streamed logs.
