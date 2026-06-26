# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Tazilla is a WordPress **block theme** (Full Site Editing / FSE) by Neotrendy. There is no PHP framework or app server
in this repo — it runs inside a WordPress installation. The theme is the active theme; pages are composed of HTML block
templates (`templates/`, `parts/`), PHP block patterns (`patterns/`), and a set of custom Gutenberg blocks (`blocks/`).

## Build commands

The theme's own `style.css`, templates, parts, and patterns are **not compiled** — edit them directly. Only the JS/SCSS
blocks under `blocks/` (and the editor plugin under `inc/editor/`) are built with `@wordpress/scripts`.

There is **no aggregate build script** — each block is built/watched individually via its own npm script. Pattern:

```bash
npm run build:<name>     # one-off production build of a block
npm run start:<name>     # watch mode for that block
```

Examples: `build:extensions`, `build:editor`, `build:feature-button`, `build:category-filter`, `build:pricing-table`,
`build:mega-slider`, `build:testimonials`. See `package.json` `scripts` for the full list — every block with a `src/`
has a matching `build:`/`start:` pair, output goes to that block's `build/` directory.

Notes:

- `build/` directories are committed to git (WordPress loads them at runtime; there is no CI build step).
- `category-filter` builds with `--experimental-modules` because it uses the Interactivity API as an ES module.
- There is **no lint or test setup** in this repo.

## Architecture

### Bootstrap

`functions.php` is the entry point. It enqueues front-end/editor/admin assets and then `require`s the modules in `inc/`:

- `inc/blocks.php` — registers all custom blocks, block styles, and contains `render_block` filters (see below). This is
  the most important file to read.
- `inc/custom-post-types.php` — registers the `feature` CPT (archive and REST enabled).
- `inc/custom-meta-fields.php`, `inc/user-profile.php`, `inc/theme-settings.php`, `inc/shortcodes.php` — meta fields,
  author profile fields, the theme settings admin page, and the `[year]` shortcode.

WordPress's bundled patterns and the remote pattern directory are **disabled** in `inc/blocks.php` (
`remove_theme_support('core-block-patterns')`, `should_load_remote_block_patterns` → false), so only this theme's
patterns appear in the inserter.

### Custom blocks (`blocks/*`)

Each block is a self-contained directory: `block.json` (manifest), `src/` (JSX/SCSS source), `build/` (compiled output).
All custom blocks are registered in `tazilla_register_blocks()` in `inc/blocks.php`. Two flavors:

- **Static/edit-time blocks** — `editorScript` + `style` only (e.g. `feature-button`).
- **Server-rendered blocks** — declare `"render": "file:./render.php"` and render dynamically in PHP (e.g. `author-box`,
  `category-filter`, `features-navigation`).
- **Interactive blocks** — use `@wordpress/interactivity` via a `view.js` with a `store('tazilla/...')` (e.g.
  `category-filter`).

Composite blocks come in parent/child sets that use `block.json` `ancestor`/`parent` (e.g. `features` →
`feature-button`/`feature-content`; `pricing-table` → `*-row`/`*-cell`; `mega-slider` → `mega-slide`; `testimonials` →
`testimonial`).

`blocks/extensions/` is special: it does **not** register a block. It extends existing core blocks in the editor (
advanced settings, latest-posts options, responsive visibility) and ships the editor/front-end extension stylesheet (
`build/style-index.css`) that `functions.php` enqueues globally.

### Key `render_block` filters in `inc/blocks.php`

These mutate core block output at render time — check here before debugging "why does this core block behave oddly":

- **Latest Posts "Read more"** — appends a read-more link when `showReadMore` attr is set.
- **Category filter** — the interactivity block writes `category-filter[-{queryId}]` URL params; `pre_get_posts` and
  `query_loop_block_query_vars` read them to filter the main query and Query Loop blocks respectively.
- **Polylang synced-pattern translation** — re-renders `core/block` (synced pattern) refs in the correct language inside
  FSE templates, which Polylang doesn't handle reliably on its own.
- **Try-for-free button** — rewrites the href of any `core/button` with the `isTryForFreeLink` attr to the URL from the
  `tazilla_try_for_free_url` option (Polylang-aware).

The theme assumes **Polylang (Pro)** for multilingual support; several filters call `pll_get_post()` guarded by
`function_exists`.

### Design tokens

`theme.json` defines the palette, typography, spacing, and registers `customTemplates` (e.g. `single-feature`,
full-width pages). Slug references colors/fonts in templates and SCSS — prefer existing tokens over hardcoded values.
`theme.json` is indented with tabs (enforced by `.editorconfig`); the rest of the codebase uses spaces.

### Templates & patterns

- `templates/*.html` — FSE page/post templates (block markup).
- `parts/*.html` — reusable template parts (headers, footers, query loops).
- `patterns/*.php` — block patterns registered automatically by WordPress from this directory.

## Conventions

- All code lives inside this theme directory; only edit git-tracked files here. `node_modules/` is not tracked.
- PHP functions and hooks are prefixed `tazilla_`; text domain is `tazilla`; custom block names are `tazilla/<name>`.
- After editing a block's `src/`, run its `build:<name>` script and commit the regenerated `build/` output.
