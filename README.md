# Tazilla.com

Tazilla.com is a WordPress-based project featuring a custom block-based theme called "Tazilla". The theme is designed with modern WordPress practices, utilizing Gutenberg blocks, patterns, and the Interactivity API.

## Tech Stack

- **Core:** [WordPress](https://wordpress.org/)
- **Language:** PHP, JavaScript (ES6+)
- **Theme Framework:** WordPress Block Theme (FSE ready)
- **Frontend Tools:** `@wordpress/scripts`, SCSS
- **Package Manager:** npm (for theme development)

## Prerequisites

- **PHP:** 8.3 or higher (8.4+ recommended)
- **Database:** MySQL 8.0+ or MariaDB 10.6+
- **Web Server:** Apache (with `mod_rewrite`) or Nginx
- **Node.js & npm:** For theme development and building assets

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tazilla-com/tazilla-wp-theme.git
   cd tazilla.com
   ```
2. **install WordPress**
   - Download the latest version of WordPress from [wordpress.org](https://wordpress.org/download/).
   - Extract the archive and copy the `wordpress` folder content to the project root.

2. **Configure WordPress:**
   - Copy `wp-config-sample.php` to `wp-config.php` (if not already present).
   - Update database credentials (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`).
   - Add unique keys and salts.

3. **Install Theme Dependencies (for development only):**
   ```bash
   cd wp-content/themes/tazilla
   npm install
   ```

4. **Build Theme Assets (for development only):**
   ```bash
   npm run build:editor
   # Run other build scripts as needed (see Scripts section)
   ```

## Environment Variables

Configuration is primarily handled via `wp-config.php`. Key constants used:

- `WP_DEBUG`: Set to `true` for development.
- `WP_ENVIRONMENT_TYPE`: Set to `local`, `development`, `staging`, or `production`.
- `WP_DEVELOPMENT_MODE`: Set to `theme` for theme development.
- `SMTP_*`: Constants for email configuration (Host, User, Pass, etc.).

## Scripts

Theme development scripts are located in `wp-content/themes/tazilla/package.json`.

### Build Scripts
- `npm run build:editor`: Compiles editor-side assets.
- `npm run build:extensions`: Compiles block extensions.
- `npm run build:<block-name>`: Compiles specific blocks (e.g., `mega-slider`, `pricing-table`, `features`).

### Development (Watch) Scripts
- `npm run start:editor`: Watches and recompiles editor assets.
- `npm run start:<block-name>`: Watches and recompiles specific blocks.

## Project Structure

```text
.
├── wp-admin/              # WordPress core admin files
├── wp-content/
│   ├── plugins/           # WordPress plugins
│   └── themes/
│       └── tazilla/       # Custom Tazilla theme
│           ├── assets/    # Static assets (fonts, images, js, css)
│           ├── blocks/    # Custom Gutenberg blocks (src/build)
│           ├── inc/       # PHP includes (CPTs, settings, blocks registration)
│           ├── parts/     # Template parts (HTML)
│           ├── patterns/  # Block patterns (PHP)
│           ├── package.json
│           └── theme.json # Global styles and settings
├── wp-includes/           # WordPress core files
├── wp-config.php          # Project configuration
└── index.php              # Entry point
```

## Tests

TODO: Define testing strategy and add tests (e.g., PHPUnit for PHP logic, Playwright/Cypress for E2E).

## License

This project is licensed under the [GPLv2 or later](license.txt).
