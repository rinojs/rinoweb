<!--
{
  "title": "Internationalization",
  "time": "2026-01-24T10:30:00.000Z",
  "description": "Translate Rino.js pages with locale-specific JSON, nested keys, arrays, fallback values, and localized output paths."
}
-->

# Internationalization (i18n)

Rino.js provides JSON-based internationalization for both the development server and static generation. Use `<lang>key</lang>` in pages or components, then define the value in a JSON file that matches the page path.

## Configuration

Add the locales to `rino-config.js`:

```js
export default {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ko"],
  },
};
```

The default locale is generated at the normal page path. Other locales are generated under their locale prefix:

```text
pages/index.html -> dist/index.html     (English)
                 -> dist/ko/index.html  (Korean)
```

Only locales listed in `i18n.locales` are generated.

## Translation files

Locale files under `i18n/{locale}/` must follow the same path as the corresponding page:

```text
pages/index.html       i18n/en/index.json       i18n/ko/index.json
pages/about.html       i18n/en/about.json       i18n/ko/about.json
pages/docs/start.html  i18n/en/docs/start.json  i18n/ko/docs/start.json
```

In `pages/index.html`:

```html
<h1><lang>header.title</lang></h1>
<p><lang>body.content[0]</lang></p>
```

In `i18n/en/index.json`:

```json
{
  "header": { "title": "Welcome" },
  "body": { "content": ["Build a static site with Rino.js."] }
}
```

Nested objects use dot paths, and arrays use bracket paths such as `items[0].label`.

## Fallbacks and literal tags

For a non-default locale, Rino.js merges its JSON over the default-locale JSON. A missing Korean value therefore falls back to English when English is the default locale. If a key is unavailable in both files, the `<lang>` tag remains in the output instead of failing the build.

Escape a language tag when you want to display it literally:

```html
\<lang>header.title\</lang>
```

This produces:

```html
<lang>header.title</lang>
```
