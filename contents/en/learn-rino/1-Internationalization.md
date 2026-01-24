<!--
{
  "title": "Internationalization",
  "time": "2026-01-24T10:30:00.000Z",
  "description": "Rino.js has a fully-featured, flexible, and developer-friendly JSON-based internationalization system for both dev server and static generation...."
}
-->

# Internationalization (i18n)

Rino.js has a fully-featured, flexible, and developer-friendly JSON-based internationalization system for both dev server and static generation.
Localization is now deeply integrated into the compiler pipeline while staying simple and intuitive to use.

## Example:

### Structure:

```
pages/
  index.html
  about.html

i18n/
  en/
    index.json
    about.json
  ko/
    index.json
    about.json
```

Each `<lang>...</lang>` tag in your HTML will map to a key inside the corresponding JSON file:

### index.html:

```
<h1><lang>header.title</lang></h1>
<p><lang>body.content.top[0]</lang></p>
```

### i18n/en/index.json:

```
{
  "header": { "title": "Welcome" },
  "body": {
    "content": { "top": ["First content block"] }
  }
}
```

### rino-config:

You can explicitly define which locales should be built and served.
Only "en" and "ko" directories under `/i18n/` are used.
All other locale folders are ignored (safe, predictable output).
defaultLocale is applied to root pages (e.g. `/index.html`).
Localized pages will be generated under `/dist/<locale>/` automatically.

```
    i18n: {
        defaultLocale: "en",
        locales: ["en", "ko"]
    }
```

### Escape

#### Input:

```
\<lang>head.title\</lang>
<p><lang>head.title</lang></p>
<p><lang>missing.value</lang></p>
```

#### Output:

```
<lang>head.title</lang>
<p>Translated Title Here</p>
<p><lang>missing.value</lang></p>
```

### Other things to note for i18n feature:

- Supports nested objects
- Supports array indexing (e.g. `items[0].label`)
- Missing keys gracefully fallback to default locale if configured
