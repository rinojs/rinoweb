<!--
{
  "title": "Project Structure",
  "time": "2025-04-14T01:21:00.000Z",
  "description": "Understand the Rino.js v3 folders for pages, components, Markdown, content collections, assets, localization, and generated output."
}
-->

# Project Structure

Rino.js turns HTML, Markdown, CSS, JavaScript, and TypeScript into a static website. Only the folders you use are required.

```text
my-site/
  rino-config.js
  dev.js
  generate.js
  sitemap.js
  feed.js
  backoffice.js
  pages/
  components/
  mds/
  public/
  scripts/export/
  styles/export/
  contents/en/blog/
  content-theme/en/
  i18n/en/
```

## Pages and components

Files in `pages/` keep their relative paths:

```text
pages/index.html      -> dist/index.html
pages/about.html      -> dist/about.html
pages/docs/index.html -> dist/docs/index.html
```

Reusable HTML belongs in `components/`. Import a component without its `.html` extension:

```html
<component rino-import="layout/header"></component>
```

This loads `components/layout/header.html`. Use `rino-tag` to wrap the result and copy other attributes to that wrapper:

```html
<component rino-import="button" rino-tag="button" type="button" class="primary"></component>
```

Use `rino-import`, not the old `rino-path`; `rino-path` is unsupported in v3. Avoid circular component imports.

## Markdown files

Reusable Markdown goes in `mds/`:

```html
<script rino-type="md" rino-import="intro" rino-tag="section"></script>
```


## Public files
Files in `public/` are copied directly to the output root:

```text
public/favicon.ico       -> dist/favicon.ico
public/images/photo.webp -> dist/images/photo.webp
```

## Browser scripts and styles

JavaScript and TypeScript in `scripts/export/` are bundled into `dist/scripts/`:

```text
scripts/export/app.js -> dist/scripts/app.js
scripts/export/app.ts -> dist/scripts/app.js
```

CSS in `styles/export/` is resolved and minified into `dist/styles/`. Local dependencies use standard CSS syntax such as `@import "../shared/tokens.css";`. Reference generated assets normally:

```html
<link rel="stylesheet" href="/styles/app.css" />
<script src="/scripts/app.js"></script>
```

## Content collections

Markdown collections follow `contents/{theme}/{category}/{number-title}.md`:

```text
contents/en/blog/1-first-post.md
```

A file starts with metadata in a JSON comment:

```md
<!--
{
  "title": "Welcome",
  "time": "2026-08-31T10:00:00.000Z",
  "description": "The first post."
}
-->

# Hello
```

Each theme needs `content-theme/{theme}/content.html` and `content-list.html`. Content templates can use `{{ content.title }}`, `{{ content.body }}`, `{{ content.urlPath }}`, and `{{ content.time }}`. Content list template receive content list data from argument. And we can create pagination system.

```text
dist/contents/en/blog/1-first-post.html
dist/contents-list/en/blog/blog-1.html
```

## Configuration and generated metadata

`rino-config.js` controls the output directory, development port, site URL, extra sitemap URLs, and locales:

```js
export default {
  dist: "./dist",
  port: 3000,
  site: { url: "https://example.com" },
  sitemap: ["https://example.com/custom-page"],
  i18n: { defaultLocale: "en", locales: ["en", "ko"] },
};
```

Rino.js can generate `sitemap.xml`, RSS and Atom feeds from content metadata, and theme-specific feed files. The optional backoffice server provides content and image tools and starts at the next available port from `3100`.
